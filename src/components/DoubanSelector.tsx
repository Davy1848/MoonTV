/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SelectorOption {
  label: string;
  value: string;
}

interface DoubanSelectorProps {
  type: 'movie' | 'tv' | 'show';
  primarySelection?: string;
  secondarySelection?: string;
  onPrimaryChange: (value: string) => void;
  onSecondaryChange: (value: string) => void;
}

const DoubanSelector: React.FC<DoubanSelectorProps> = ({
  type,
  primarySelection,
  secondarySelection,
  onPrimaryChange,
  onSecondaryChange,
}) => {
  // 为不同的选择器创建独立的refs和状态
  const primaryContainerRef = useRef<HTMLDivElement>(null);
  const primaryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [primaryIndicatorStyle, setPrimaryIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  const secondaryContainerRef = useRef<HTMLDivElement>(null);
  const secondaryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [secondaryIndicatorStyle, setSecondaryIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  // 电影的一级选择器选项
  const moviePrimaryOptions: SelectorOption[] = [
    { label: '热门电影', value: '热门' },
    { label: '最新上映', value: '最新' },
    { label: '豆瓣高分', value: '豆瓣高分' },
    { label: '冷门佳片', value: '冷门佳片' },
    { label: 'Netflix', value: 'Netflix' },
    { label: '动作片', value: '动作' },
    { label: '喜剧片', value: '喜剧' },
    { label: '爱情片', value: '爱情' },
    { label: '科幻片', value: '科幻' },
    { label: '恐怖片', value: '恐怖' },
    { label: '悬疑片', value: '悬疑' },
    { label: '纪录片', value: '纪录' },
    { label: '动画片', value: '动画' },
    { label: '犯罪片', value: '犯罪' },
    { label: '战争片', value: '战争' },
    { label: '奇幻片', value: '奇幻' },
    { label: '剧情片', value: '剧情' },
    { label: '漫威系列', value: '漫威' },
    { label: 'DC系列', value: 'DC' },
    { label: 'Pixar', value: 'Pixar' },
    { label: '迪士尼', value: '迪士尼' },
  ];

  // 电影的二级选择器选项
  const movieSecondaryOptions: SelectorOption[] = [
    { label: '全部地区', value: '全部' },
    { label: '中国大陆', value: '华语_大陆' },
    { label: '中国香港', value: '华语_香港' },
    { label: '中国台湾', value: '华语_台湾' },
    { label: '美国', value: '欧美_美国' },
    { label: '英国', value: '欧美_英国' },
    { label: '其他欧美', value: '欧美_other' },
    { label: '韩国', value: '韩国' },
    { label: '日本', value: '日本' },
    { label: '印度', value: '印度' },
    { label: '泰国', value: '泰国' },
    { label: '获奖影片', value: 'award' },
    { label: '高分纪录片', value: 'doc_high' },
  ];

  // 电视剧选择器选项
  const tvOptions: SelectorOption[] = [
  { label: '全部剧集', value: 'tv' },
  { label: '热门推荐', value: 'tv_hot' },
  { label: '高分精选', value: 'tv_high_rated' },
  { label: '新剧上线', value: 'tv_new' },
  { label: '中国大陆', value: 'tv_china_mainland' },
  { label: '中国香港', value: 'tv_hongkong' },
  { label: '中国台湾', value: 'tv_taiwan' },
  { label: '新加坡', value: 'tv_singapore' },
  { label: '马来西亚', value: 'tv_malaysia' },
  { label: '日本', value: 'tv_japanese' },
  { label: '韩国', value: 'tv_korean' },
  { label: '朝鲜', value: 'tv_northkorea' },
  { label: '美国', value: 'tv_usa' },
  { label: '英国', value: 'tv_uk' },
  { label: '加拿大', value: 'tv_canada' },
  { label: '澳大利亚', value: 'tv_australia' },
  { label: '德国', value: 'tv_germany' },
  { label: '法国', value: 'tv_france' },
  { label: '意大利', value: 'tv_italy' },
  { label: '西班牙', value: 'tv_spain' },
  { label: '俄罗斯', value: 'tv_russia' },
  { label: '泰国', value: 'tv_thailand' },
  { label: '印度尼西亚', value: 'tv_indonesia' },
  { label: '菲律宾', value: 'tv_philippines' },
  { label: '越南', value: 'tv_vietnam' },
  { label: '印度', value: 'tv_india' },
  { label: '巴基斯坦', value: 'tv_pakistan' },
  { label: '科幻', value: 'tv_genre_scifi' },
  { label: '悬疑', value: 'tv_genre_mystery' },
  { label: '爱情', value: 'tv_genre_romance' },
  { label: '喜剧', value: 'tv_genre_comedy' },
  { label: '动作', value: 'tv_genre_action' },
  { label: '动漫剧集', value: 'tv_animation' },
  { label: '纪录片', value: 'tv_documentary' },
  { label: '迷你剧', value: 'tv_miniseries' },
  ];

  // 综艺选择器选项
  const showOptions: SelectorOption[] = [
    { label: '全部综艺', value: 'show_all' },
    { label: '热门综艺', value: 'show_hot' },
    { label: '高分综艺', value: 'show_high' },
    { label: '新上线综艺', value: 'show_new' },
    { label: '真人秀', value: 'show_reality' },
    { label: '脱口秀', value: 'show_talk' },
    { label: '竞技比赛', value: 'show_competition' },
    { label: '访谈节目', value: 'show_interview' },
    { label: '音乐综艺', value: 'show_music' },
    { label: '搞笑综艺', value: 'show_comedy' },
    { label: '生活体验', value: 'show_life' },
    { label: '户外冒险', value: 'show_outdoor' },
    { label: '中国大陆', value: 'show_cn' },
    { label: '中国台湾', value: 'show_tw' },
    { label: '中国香港', value: 'show_hk' },
    { label: '韩国', value: 'show_kr' },
    { label: '日本', value: 'show_jp' },
    { label: '欧美', value: 'show_ww' },
    { label: '东南亚', value: 'show_sea' },
    { label: 'Netflix', value: 'show_netflix' },
    { label: 'B站独播', value: 'show_bilibili' },
    { label: '芒果TV', value: 'show_mango' },
  ];

  // 更新指示器位置的通用函数
  const updateIndicatorPosition = (
    activeIndex: number,
    containerRef: React.RefObject<HTMLDivElement>,
    buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
    setIndicatorStyle: React.Dispatch<
      React.SetStateAction<{ left: number; width: number }>
    >
  ) => {
    if (
      activeIndex >= 0 &&
      buttonRefs.current[activeIndex] &&
      containerRef.current
    ) {
      const timeoutId = setTimeout(() => {
        const button = buttonRefs.current[activeIndex];
        const container = containerRef.current;
        if (button && container) {
          const buttonRect = button.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          if (buttonRect.width > 0) {
            setIndicatorStyle({
              left: buttonRect.left - containerRect.left,
              width: buttonRect.width,
            });
          }
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  };

  // 组件挂载时立即计算初始位置
  useEffect(() => {
    // 主选择器初始位置
    if (type === 'movie') {
      const activeIndex = moviePrimaryOptions.findIndex(
        (opt) =>
          opt.value === (primarySelection || moviePrimaryOptions[0].value)
      );
      updateIndicatorPosition(
        activeIndex,
        primaryContainerRef,
        primaryButtonRefs,
        setPrimaryIndicatorStyle
      );
    }

    // 副选择器初始位置
    let secondaryActiveIndex = -1;
    if (type === 'movie') {
      secondaryActiveIndex = movieSecondaryOptions.findIndex(
        (opt) =>
          opt.value === (secondarySelection || movieSecondaryOptions[0].value)
      );
    } else if (type === 'tv') {
      secondaryActiveIndex = tvOptions.findIndex(
        (opt) => opt.value === (secondarySelection || tvOptions[0].value)
      );
    } else if (type === 'show') {
      secondaryActiveIndex = showOptions.findIndex(
        (opt) => opt.value === (secondarySelection || showOptions[0].value)
      );
    }

    if (secondaryActiveIndex >= 0) {
      updateIndicatorPosition(
        secondaryActiveIndex,
        secondaryContainerRef,
        secondaryButtonRefs,
        setSecondaryIndicatorStyle
      );
    }
  }, [type]); // 只在type变化时重新计算

  // 监听主选择器变化
  useEffect(() => {
    if (type === 'movie') {
      const activeIndex = moviePrimaryOptions.findIndex(
        (opt) => opt.value === primarySelection
      );
      const cleanup = updateIndicatorPosition(
        activeIndex,
        primaryContainerRef,
        primaryButtonRefs,
        setPrimaryIndicatorStyle
      );
      return cleanup;
    }
  }, [primarySelection]);

  // 监听副选择器变化
  useEffect(() => {
    let activeIndex = -1;
    let options: SelectorOption[] = [];

    if (type === 'movie') {
      activeIndex = movieSecondaryOptions.findIndex(
        (opt) => opt.value === secondarySelection
      );
      options = movieSecondaryOptions;
    } else if (type === 'tv') {
      activeIndex = tvOptions.findIndex(
        (opt) => opt.value === secondarySelection
      );
      options = tvOptions;
    } else if (type === 'show') {
      activeIndex = showOptions.findIndex(
        (opt) => opt.value === secondarySelection
      );
      options = showOptions;
    }

    if (options.length > 0) {
      const cleanup = updateIndicatorPosition(
        activeIndex,
        secondaryContainerRef,
        secondaryButtonRefs,
        setSecondaryIndicatorStyle
      );
      return cleanup;
    }
  }, [secondarySelection]);

  // 渲染胶囊式选择器
  const renderCapsuleSelector = (
    options: SelectorOption[],
    activeValue: string | undefined,
    onChange: (value: string) => void,
    isPrimary = false
  ) => {
    const containerRef = isPrimary
      ? primaryContainerRef
      : secondaryContainerRef;
    const buttonRefs = isPrimary ? primaryButtonRefs : secondaryButtonRefs;
    const indicatorStyle = isPrimary
      ? primaryIndicatorStyle
      : secondaryIndicatorStyle;

    return (
      <div
        ref={containerRef}
        className='relative inline-flex bg-gray-200/60 rounded-full p-0.5 sm:p-1 dark:bg-gray-700/60 backdrop-blur-sm'
      >
        {/* 滑动的白色背景指示器 */}
        {indicatorStyle.width > 0 && (
          <div
            className='absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 bg-white dark:bg-gray-500 rounded-full shadow-sm transition-all duration-300 ease-out'
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        )}

        {options.map((option, index) => {
          const isActive = activeValue === option.value;
          return (
            <button
              key={option.value}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              onClick={() => onChange(option.value)}
              className={`relative z-10 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-gray-900 dark:text-gray-100 cursor-default'
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* 电影类型 - 显示两级选择器 */}
      {type === 'movie' && (
        <div className='space-y-3 sm:space-y-4'>
          {/* 一级选择器 */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
            <span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]'>
              分类
            </span>
            <div className='overflow-x-auto'>
              {renderCapsuleSelector(
                moviePrimaryOptions,
                primarySelection || moviePrimaryOptions[0].value,
                onPrimaryChange,
                true
              )}
            </div>
          </div>

          {/* 二级选择器 */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
            <span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]'>
              地区
            </span>
            <div className='overflow-x-auto'>
              {renderCapsuleSelector(
                movieSecondaryOptions,
                secondarySelection || movieSecondaryOptions[0].value,
                onSecondaryChange,
                false
              )}
            </div>
          </div>
        </div>
      )}

      {/* 电视剧类型 - 只显示一级选择器 */}
      {type === 'tv' && (
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]'>
            类型
          </span>
          <div className='overflow-x-auto'>
            {renderCapsuleSelector(
              tvOptions,
              secondarySelection || tvOptions[0].value,
              onSecondaryChange,
              false
            )}
          </div>
        </div>
      )}

      {/* 综艺类型 - 只显示一级选择器 */}
      {type === 'show' && (
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]'>
            类型
          </span>
          <div className='overflow-x-auto'>
            {renderCapsuleSelector(
              showOptions,
              secondarySelection || showOptions[0].value,
              onSecondaryChange,
              false
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoubanSelector;
