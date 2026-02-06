/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { CheckCircle, Heart, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  deleteFavorite,
  deletePlayRecord,
  generateStorageKey,
  isFavorited,
  saveFavorite,
  subscribeToDataUpdates,
} from '@/lib/db.client';
import { SearchResult } from '@/lib/types';
import { processImageUrl } from '@/lib/utils';


interface VideoCardProps {
  id?: string;
  source?: string;
  title?: string;
  query?: string;
  poster?: string;
  episodes?: number;
  source_name?: string;
  progress?: number;
  year?: string;
  from: 'playrecord' | 'favorite' | 'search' | 'douban';
  currentEpisode?: number;
  douban_id?: string;
  onDelete?: () => void;
  rate?: string;
  items?: SearchResult[];
  type?: string;
}

export default function VideoCard({
  id,
  title = '',
  query = '',
  poster = '',
  episodes,
  source,
  source_name,
  progress = 0,
  year,
  from,
  currentEpisode,
  douban_id,
  onDelete,
  rate,
  items,
  type = '',
}: VideoCardProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAggregate = from === 'search' && !!items?.length;

  // 检查海报 URL 是否有效的函数
  const isValidPosterUrl = (url: string): boolean => {
    if (!url || url === '' || typeof url !== 'string') return false;
    
    // 清理URL，去除首尾空格
    const trimmedUrl = url.trim();
    if (trimmedUrl === '') return false;
    
    // 检查是否以 http 或 https 开头
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      // 检查 URL 格式是否基本有效
      try {
        new URL(trimmedUrl);
        return true;
      } catch {
        return false;
      }
    }
    
    // 检查是否为相对路径或其他可能的有效格式
    // 这里我们暂时认为相对路径是有效的，因为它们可能在特定API上下文中有效
    return trimmedUrl.length > 0;
  };

  const aggregateData = useMemo(() => {
    if (!isAggregate || !items) return null;
    const countMap = new Map<string | number, number>();
    const episodeCountMap = new Map<number, number>();
    const posterMap = new Map<string, number>();
    
    // 存储所有有效海报的数组，用于备选
    const validPosters: string[] = [];
    
    items.forEach((item) => {
      if (item.douban_id && item.douban_id !== 0) {
        countMap.set(item.douban_id, (countMap.get(item.douban_id) || 0) + 1);
      }
      const len = item.episodes?.length || 0;
      // 无论剧集长度是多少，都计入 episodeCountMap
      episodeCountMap.set(len, (episodeCountMap.get(len) || 0) + 1);
      // 计入有效的海报图片 URL
      if (item.poster && isValidPosterUrl(item.poster)) {
        const posterUrl = item.poster.trim();
        posterMap.set(posterUrl, (posterMap.get(posterUrl) || 0) + 1);
        validPosters.push(posterUrl);
      }
    });

    const getMostFrequent = <T extends string | number>(
      map: Map<T, number>
    ) => {
      let maxCount = 0;
      let result: T | undefined;
      map.forEach((cnt, key) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          result = key;
        }
      });
      return result;
    };

    // 计算最常见的剧集数量，如果没有则使用第一个项目的剧集数量
    const mostFrequentEpisodes = getMostFrequent(episodeCountMap) ?? (items[0]?.episodes?.length || 0);
    // 计算最常见的海报图片 URL
    const mostFrequentPoster = getMostFrequent(posterMap);
    // 找到第一个有有效海报的项目
    const firstWithPoster = items.find(item => item.poster && isValidPosterUrl(item.poster));
    // 找到所有有效海报中的第一个
    const firstValidPoster = validPosters[0];

    return {
      first: items[0],
      mostFrequentDoubanId: getMostFrequent(countMap),
      mostFrequentEpisodes,
      mostFrequentPoster,
      firstWithPoster,
      firstValidPoster,
      validPostersCount: validPosters.length,
    };
  }, [isAggregate, items]);

  const actualTitle = (aggregateData?.first.title ?? title) || '';
  const actualPoster = (aggregateData?.mostFrequentPoster ?? aggregateData?.firstWithPoster?.poster ?? aggregateData?.firstValidPoster ?? aggregateData?.first.poster ?? poster) || '';
  const actualSource = (aggregateData?.first.source ?? source) || '';
  const actualId = (aggregateData?.first.id ?? id) || '';
  const actualDoubanId = String(
    (aggregateData?.mostFrequentDoubanId ?? douban_id) || ''
  );
  const actualEpisodes = aggregateData?.mostFrequentEpisodes ?? episodes ?? 0;
  const actualYear = (aggregateData?.first.year ?? year) || '';
  const actualQuery = query || '';
  const actualSearchType = isAggregate
    ? aggregateData?.first.episodes?.length === 1
      ? 'movie'
      : 'tv'
    : type;

  // 获取收藏状态
  useEffect(() => {
    if (from === 'douban' || !actualSource || !actualId) return;

    const fetchFavoriteStatus = async () => {
      try {
        const fav = await isFavorited(actualSource, actualId);
        setFavorited(fav);
      } catch (err) {
        throw new Error('检查收藏状态失败');
      }
    };

    fetchFavoriteStatus();

    // 监听收藏状态更新事件
    const storageKey = generateStorageKey(actualSource, actualId);
    const unsubscribe = subscribeToDataUpdates(
      'favoritesUpdated',
      (newFavorites: Record<string, any>) => {
        // 检查当前项目是否在新的收藏列表中
        const isNowFavorited = !!newFavorites[storageKey];
        setFavorited(isNowFavorited);
      }
    );

    return unsubscribe;
  }, [from, actualSource, actualId]);

  const handleToggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (from === 'douban' || !actualSource || !actualId) return;
      try {
        if (favorited) {
          // 如果已收藏，删除收藏
          await deleteFavorite(actualSource, actualId);
          setFavorited(false);
        } else {
          // 如果未收藏，添加收藏
          await saveFavorite(actualSource, actualId, {
            title: actualTitle,
            source_name: source_name || '',
            year: actualYear || '',
            cover: actualPoster,
            total_episodes: actualEpisodes ?? 1,
            save_time: Date.now(),
          });
          setFavorited(true);
        }
      } catch (err) {
        throw new Error('切换收藏状态失败');
      }
    },
    [
      from,
      actualSource,
      actualId,
      actualTitle,
      source_name,
      actualYear,
      actualPoster,
      actualEpisodes,
      favorited,
    ]
  );

  const handleDeleteRecord = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (from !== 'playrecord' || !actualSource || !actualId) return;
      try {
        await deletePlayRecord(actualSource, actualId);
        onDelete?.();
      } catch (err) {
        throw new Error('删除播放记录失败');
      }
    },
    [from, actualSource, actualId, onDelete]
  );

  const handleClick = useCallback(() => {
    if (from === 'douban') {
      router.push(
        `/play?title=${encodeURIComponent(actualTitle.trim())}${
          actualYear ? `&year=${actualYear}` : ''
        }${actualSearchType ? `&stype=${actualSearchType}` : ''}`
      );
    } else if (actualSource && actualId) {
      router.push(
        `/play?source=${actualSource}&id=${actualId}&title=${encodeURIComponent(
          actualTitle
        )}${actualYear ? `&year=${actualYear}` : ''}${
          isAggregate ? '&prefer=true' : ''
        }${
          actualQuery ? `&stitle=${encodeURIComponent(actualQuery.trim())}` : ''
        }${actualSearchType ? `&stype=${actualSearchType}` : ''}`
      );
    }
  }, [
    from,
    actualSource,
    actualId,
    router,
    actualTitle,
    actualYear,
    isAggregate,
    actualQuery,
    actualSearchType,
  ]);

  const config = useMemo(() => {
    const configs = {
      playrecord: {
        showSourceName: true,
        showProgress: true,
        showPlayButton: true,
        showHeart: true,
        showCheckCircle: true,
        showDoubanLink: false,
        showRating: false,
      },
      favorite: {
        showSourceName: true,
        showProgress: false,
        showPlayButton: true,
        showHeart: true,
        showCheckCircle: false,
        showDoubanLink: false,
        showRating: false,
      },
      search: {
        showSourceName: true,
        showProgress: false,
        showPlayButton: true,
        showHeart: !isAggregate,
        showCheckCircle: false,
        showDoubanLink: !!actualDoubanId,
        showRating: false,
      },
      douban: {
        showSourceName: false,
        showProgress: false,
        showPlayButton: true,
        showHeart: false,
        showCheckCircle: false,
        showDoubanLink: true,
        showRating: !!rate,
      },
    };
    return configs[from] || configs.search;
  }, [from, isAggregate, actualDoubanId, rate]);

  // 海报加载状态管理
  const [posterLoading, setPosterLoading] = useState(false);
  const [posterError, setPosterError] = useState(false);

  const handlePosterLoad = () => {
    setPosterLoading(false);
    setPosterError(false);
  };

  const handlePosterError = () => {
    setPosterLoading(false);
    setPosterError(true);
  };

  return (
    // 搜索页面使用海报卡片布局
    from === 'search' ? (
      <div
        className="relative cursor-pointer w-full aspect-[2/3] rounded-lg overflow-hidden border border-gray-800"
        onClick={handleClick}
      >
        <div className="w-full h-full bg-gray-900">
          {actualPoster && actualPoster !== '' ? (
            <>
              {posterLoading && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-gray-400 text-sm">加载中...</span>
                </div>
              )}
              <img
                src={processImageUrl(actualPoster)}
                alt={actualTitle}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                onLoad={handlePosterLoad}
                onError={handlePosterError}
                onLoadStart={() => setPosterLoading(true)}
              />
              {posterError && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-gray-400 text-sm">海报加载失败</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <span className="text-gray-400 text-sm">暂无海报</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <span className="text-white font-semibold text-sm truncate block mb-1">
            {actualTitle || '未知标题'}
          </span>
          <div className="flex items-center gap-2">
            {actualYear && actualYear !== '' && actualYear !== 'unknown' && (
              <span className="text-gray-300 text-xs">
                {actualYear}
              </span>
            )}
            {actualEpisodes > 0 && (
              <span className="text-gray-300 text-xs">
                {actualEpisodes > 1 ? `${actualEpisodes}集` : '电影'}
              </span>
            )}
            {source_name && source_name !== '' && (
              <span className="text-gray-300 text-xs">
                {source_name}
              </span>
            )}
          </div>
        </div>
      </div>
    ) : (
      // 其他页面使用文本卡片布局
      <div
        className="relative cursor-pointer w-full h-[50px] border border-gray-800 rounded m-0 p-0"
        onClick={handleClick}
      >
        {/* 豆瓣上下文的布局（电影、剧集、综艺） */}
        {from === 'douban' && (
          <div className='p-2 h-full flex items-center'>
            <div className='flex-1 min-w-0 flex items-center gap-2'>
              <span className='text-sm font-semibold text-white truncate'>
                {actualTitle}
              </span>
              {actualYear && (
                <span className='text-xs text-gray-300 whitespace-nowrap'>
                  ({actualYear})
                </span>
              )}
              {actualSearchType && (
                <span className='text-xs text-gray-300 whitespace-nowrap'>
                  [{actualSearchType === 'movie' ? '电影' : actualSearchType === 'tv' ? '剧集' : actualSearchType}]
                </span>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {config.showRating && rate && (
                <span className='text-sm font-bold text-pink-400 whitespace-nowrap'>
                  {rate}
                </span>
              )}
              {config.showDoubanLink && actualDoubanId && (
                <a
                  href={`https://movie.douban.com/subject/${actualDoubanId}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                  className='text-gray-300 hover:text-green-400 transition-colors'
                >
                  <Link size={16} />
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* 其他上下文的布局（播放记录、收藏夹） */}
        {from !== 'douban' && (
          <div className='p-2 h-full flex items-center'>
            <div className='flex-1 min-w-0 flex items-center gap-2'>
              <span className='text-sm font-semibold text-white truncate'>
                {actualTitle}
              </span>
              {actualYear && (
                <span className='text-xs text-gray-300 whitespace-nowrap'>
                  ({actualYear})
                </span>
              )}
              {actualSearchType && (
                <span className='text-xs text-gray-300 whitespace-nowrap'>
                  [{actualSearchType === 'movie' ? '电影' : actualSearchType === 'tv' ? '剧集' : actualSearchType}]
                </span>
              )}
              {config.showSourceName && source_name && (
                <span className='text-xs text-gray-300 whitespace-nowrap'>
                  来源: {source_name}
                </span>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {config.showRating && rate && (
                <span className='text-xs font-bold text-pink-400 whitespace-nowrap'>
                  {rate}
                </span>
              )}
              {actualEpisodes && actualEpisodes > 1 && (
                <span className='text-xs text-green-400 whitespace-nowrap'>
                  {currentEpisode
                    ? `${currentEpisode}/${actualEpisodes}`
                    : actualEpisodes}
                </span>
              )}
              {config.showHeart && (
                <Heart
                  onClick={handleToggleFavorite}
                  size={16}
                  className={`transition-colors ${
                    favorited
                      ? 'fill-red-600 stroke-red-600'
                      : 'fill-transparent stroke-gray-400 hover:stroke-red-400'
                  }`}
                />
              )}
              {config.showCheckCircle && (
                <CheckCircle
                  onClick={handleDeleteRecord}
                  size={16}
                  className='stroke-gray-400 hover:stroke-green-400 transition-colors'
                />
              )}
              {config.showDoubanLink && actualDoubanId && (
                <a
                  href={`https://movie.douban.com/subject/${actualDoubanId}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                  className='text-gray-400 hover:text-green-400 transition-colors'
                >
                  <Link size={16} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    )
  );
}
