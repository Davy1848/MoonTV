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
    // 热门与评分维度
    { label: '热门电影', value: '热门' },
    { label: '最新上映', value: '最新' },
    { label: '豆瓣高分', value: '豆瓣高分' },
    { label: '冷门佳片', value: '冷门佳片' },
    { label: 'Netflix', value: 'Netflix' },
    
    // 核心类型
    { label: '动作片', value: '动作' },
    { label: '喜剧片', value: '喜剧' },
    { label: '爱情片', value: '爱情' },
    { label: '科幻片', value: '科幻' },
    { label: '恐怖片', value: '恐怖' },
    { label: '悬疑片', value: '悬疑' },
    { label: '纪录片', value: '纪录' },
    
    // 子类型
    { label: '动画片', value: '动画' },
    { label: '犯罪片', value: '犯罪' },
    { label: '战争片', value: '战争' },
    { label: '奇幻片', value: '奇幻' },
    { label: '剧情片', value: '剧情' },
    
    // 厂牌/系列
    { label: '漫威系列', value: '漫威' },
    { label: '迪士尼', value: '迪士尼' },
    { label: 'DC系列', value: 'DC' },
    { label: '哈利波特', value: '哈利波特' },
    { label: 'Netflix原创', value: 'Netflix原创' },
    
    // 年代区间
    { label: '2025年新片', value: '2025年' },
    { label: '2024年新片', value: '2024年' },
    { label: '2023年新片', value: '2023年' },
    { label: '2020-2022', value: '2020至2022' },
    { label: '2010-2019', value: '2010至2019' },
    { label: '经典老片(2000前)', value: '经典老片' },
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

  // 电视剧一级选择器选项
  const tvPrimaryOptions: SelectorOption[] = [
    { label: '全部剧集', value: '全部剧集' },
    { label: '热门剧集', value: '热门剧集' },
    { label: '最新上线', value: '最新上线' },
    { label: '豆瓣高分', value: '剧集高分' },
    { label: '热门新剧', value: '热门新剧' },
    { label: '经典剧集', value: '经典剧集' },
  ];

  // 电视剧二级选择器选项
  const tvSecondaryOptions: SelectorOption[] = [
    { label: '国产剧', value: '国产剧' },
    { label: '欧美剧', value: '欧美剧' },
    { label: '亚洲剧', value: '亚洲剧' },
    { label: 'Netflix', value: 'Netflix' },
    
    // 国产剧细分
    { label: '国产-现代都市', value: '国产现代都市' },
    { label: '国产-古装历史', value: '国产古装历史' },
    { label: '国产-悬疑推理', value: '国产悬疑推理' },
    { label: '国产-青春校园', value: '国产青春校园' },
    { label: '国产-家庭伦理', value: '国产家庭伦理' },
    { label: '国产-军旅抗战', value: '国产军旅抗战' },
    
    // 欧美剧细分
    { label: '美剧-科幻', value: '美剧科幻' },
    { label: '美剧-犯罪', value: '美剧犯罪' },
    { label: '英剧-古典', value: '英剧古典' },
    { label: '英剧-喜剧', value: '英剧喜剧' },
    { label: '欧洲剧-悬疑', value: '欧洲剧悬疑' },
    { label: 'Netflix-原创剧集', value: 'Netflix原创剧集' },
    
    // 亚洲剧细分
    { label: '日剧-爱情', value: '日剧爱情' },
    { label: '日剧-悬疑', value: '日剧悬疑' },
    { label: '韩剧-浪漫', value: '韩剧浪漫' },
    { label: '韩剧-狗血', value: '韩剧狗血' },
    { label: '泰剧-爱情', value: '泰剧爱情' },
    
    // 特殊类型
    { label: '动漫剧集', value: '动漫剧集' },
    { label: '纪录片', value: '纪录片' },
    { label: '真人秀', value: '真人秀' },
    { label: '科幻剧集', value: '科幻剧集' },
    { label: '迷你剧', value: '迷你剧' },
  ];

  // 综艺一级选择器选项
  const showPrimaryOptions: SelectorOption[] = [
    { label: '全部综艺', value: 'show_all' },
    { label: '热门综艺', value: 'show_hot' },
    { label: '高分综艺', value: 'show_high' },
    { label: '新上线综艺', value: 'show_new' },
    { label: '经典综艺', value: 'show_classic' },
  ];

  // 综艺二级选择器选项
  const showSecondaryOptions: SelectorOption[] = [
    // 综艺类型
    { label: '真人秀', value: 'show_reality' },
    { label: '脱口秀', value: 'show_talk' },
    { label: '竞技比赛', value: 'show_competition' },
    { label: '访谈节目', value: 'show_interview' },
    { label: '音乐综艺', value: 'show_music' },
    { label: '搞笑综艺', value: 'show_comedy' },
    { label: '生活体验', value: 'show_life' },
    { label: '户外冒险', value: 'show_outdoor' },
    
    // 地区分类
    { label: '中国大陆', value: 'show_cn' },
    { label: '中国台湾', value: 'show_tw' },
    { label: '中国香港', value: 'show_hk' },
    { label: '韩国', value: 'show_kr' },
    { label: '日本', value: 'show_jp' },
    { label: '欧美', value: 'show_ww' },
    { label: '东南亚', value: 'show_sea' },
    
    // 平台特色
    { label: 'Netflix原创', value: 'show_netflix' },
    { label: 'B站独播', value: 'show_bilibili' },
    { label: '芒果TV', value: 'show_mango' },
  ];

  // 获取当前类型的选项
  const getOptionsByType = () => {
    switch (type) {
      case 'movie':
        return { primary: moviePrimaryOptions, secondary: movieSecondaryOptions };
      case 'tv':
        return { primary: tvPrimaryOptions, secondary: tvSecondaryOptions };
      case 'show':
        return { primary: showPrimaryOptions, secondary: showSecondaryOptions };
      default:
        return { primary: [], secondary: [] };
    }
  };

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
      // 使用requestAnimationFrame确保DOM已更新
      const rafId = requestAnimationFrame(() => {
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
      });
      return () => cancelAnimationFrame(rafId);
    }
    return () => {};
  };

  // 组件挂载和更新时计算初始位置
  useEffect(() => {
    const { primary, secondary } = getOptionsByType();
    
    // 主选择器初始位置
    if (primary.length > 0) {
      const activeValue = primarySelection || primary[0].value;
      const activeIndex = primary.findIndex(opt => opt.value === activeValue);
      const normalizedIndex = activeIndex >= 0 ? activeIndex : 0;
      
      const cleanup = updateIndicatorPosition(
        normalizedIndex,
        primaryContainerRef,
        primaryButtonRefs,
        setPrimaryIndicatorStyle
      );
    }

    // 副选择器初始位置
    if (secondary.length > 0) {
      const activeValue = secondarySelection || secondary[0].value;
      const activeIndex = secondary.findIndex(opt => opt.value === activeValue);
      const normalizedIndex = activeIndex >= 0 ? activeIndex : 0;
      
      const cleanup = updateIndicatorPosition(
        normalizedIndex,
        secondaryContainerRef,
        secondaryButtonRefs,
        setSecondaryIndicatorStyle
      );
    }
  }, [type, primarySelection, secondarySelection]);

  // 监听窗口大小变化，重新计算指示器位置
  useEffect(() => {
    const handleResize = () => {
      const { primary, secondary } = getOptionsByType();
      
      // 更新主选择器
      if (primary.length > 0) {
        const activeValue = primarySelection || primary[0].value;
        const activeIndex = primary.findIndex(opt => opt.value === activeValue);
        const normalizedIndex = activeIndex >= 0 ? activeIndex : 0;
        
        updateIndicatorPosition(
          normalizedIndex,
          primaryContainerRef,
          primaryButtonRefs,
          setPrimaryIndicatorStyle
        );
      }
      
      // 更新副选择器
      if (secondary.length > 0) {
        const activeValue = secondarySelection || secondary[0].value;
        const activeIndex = secondary.findIndex(opt => opt.value === activeValue);
        const normalizedIndex = activeIndex >= 0 ? activeIndex : 0;
        
        updateIndicatorPosition(
          normalizedIndex,
          secondaryContainerRef,
          secondaryButtonRefs,
          setSecondaryIndicatorStyle
        );
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [type, primarySelection, secondarySelection]);

  // 渲染胶囊式选择器
  const renderCapsuleSelector = (
    options: SelectorOption[],
    activeValue: string | undefined,
    onChange: (value: string) => void,
    isPrimary = false
  ) => {
    if (options.length === 0) return null;
    
    const containerRef = isPrimary
      ? primaryContainerRef
      : secondaryContainerRef;
    const buttonRefs = isPrimary ? primaryButtonRefs : secondaryButtonRefs;
    const indicatorStyle = isPrimary
      ? primaryIndicatorStyle
      : secondaryIndicatorStyle;
    
    // 确保有有效的activeValue
    const validActiveValue = activeValue && options.some(opt => opt.value === activeValue)
      ? activeValue
      : options[0].value;

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
          const isActive = validActiveValue === option.value;
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
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  };

  const { primary: primaryOptions, secondary: secondaryOptions } = getOptionsByType();
  // 根据类型确定两级选择器的标签文本
  const getSelectorLabels = () => {
    switch (type) {
      case 'movie':
        return { primary: '分类', secondary: '地区' };
      case 'tv':
        return { primary: '筛选', secondary: '类型' };
      case 'show':
        return { primary: '筛选', secondary: '类型' };
      default:
        return { primary: '一级', secondary: '二级' };
    }
  };
  
  const { primary: primaryLabel, secondary: secondaryLabel } = getSelectorLabels();

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* 所有类型都显示两级选择器 */}
      <div className='space-y-3 sm:space-y-4'>
        {/* 一级选择器 */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]'>
            {primaryLabel}
          </span>
          <div className='overflow-x-auto'>
            {renderCapsuleSelector(
              primaryOptions,
