/**
 * 作品集项目数据
 * ------------------------------------------------------------------
 * 替换说明：
 * 1. 每个项目一个对象，字段含义见下方注释。
 * 2. images 数组支持多张图片，模态框内以轮播/网格展示；填入图片路径或外链即可。
 * 3. video 留空字符串则不显示视频区块；填入视频地址后自动渲染 <video>（带 poster，不自动播放）。
 * 4. link 填真实项目链接，填 "#" 或空字符串时按钮自动隐藏。
 * 5. confidential 为 true 时，卡片与详情页会显示“已脱敏”标识。
 * 6. category 为卡片上的细分标签（仅展示）：
 *    shop        店铺运营
 *    competitor  竞品分析
 *    livestream  直播运营
 *    qianchuan   千川优化
 *    content     内容创作
 * 7. filter 为顶部筛选分组（对应 3 个按钮）：
 *    shop        店铺运营
 *    integrated  运投一体（直播运营 + 千川投放）
 *    ai          AI 内容创作
 */

window.PROJECTS = [
  {
    id: 'competitor-report',
    title: '手机壳类目竞品分析 · 七家店铺定位拆解',
    category: 'competitor',
    categoryLabel: '竞品分析',
    filter: 'shop',
    role: '竞品分析主笔',
    period: '2024.03 — 2024.05',
    summary: '对手机壳类目 7 家店铺做定位拆解，输出可直接落地的差异化运营策略。',
    background:
      '所在店铺面临头部竞品挤压，增长遇到瓶颈。团队对竞品的认知停留在表面数据，缺少系统拆解，无法回答“竞品为什么增长、我们差在哪里”。',
    solution: [
      '选取手机壳类目 7 家代表性店铺作为样本，覆盖不同定位与价格带',
      '拆解各家货盘结构、价格带分布与上新节奏，还原其产品策略',
      '分析竞品内容与投流模型，归纳其流量获取路径',
      '输出定位图谱与 3 条差异化策略建议，其中 2 项被采纳落地'
    ],
    results: [
      { value: '7 家', label: '样本店铺定位拆解' },
      { value: '20+ 份', label: '累计产出深度竞品分析报告' },
      { value: '2 项', label: '策略建议被团队采纳落地' }
    ],
    images: [
      'assets/images/projects/cover-competitor.webp'
    ],
    video: '',
    link: 'competitor-analysis.html',
    confidential: true,
    confidentialNote: '报告涉及公司内部策略，竞品名称与具体策略细节已脱敏。'
  },
  {
    id: 'shop-coldstart',
    title: '某新锐品牌店铺 0-1 冷启动操盘',
    subtitle: '从 0 到 1 搭建全流程',
    category: 'shop',
    categoryLabel: '店铺运营',
    filter: 'shop',
    role: '店铺运营负责人',
    period: '2023.08 — 2024.02',
    summary: '从 0 搭建店铺视觉、货盘与会员体系，冷启动期实现店铺 GMV 同比增长约 120%。',
    overview: '独立跑通从市场选品、工具铺货、商品上架、自动化客服到付费推广的电商基础全链路闭环。',
    steps: [
      {
        title: '选品',
        desc: '通过 1688 等货源平台筛选源头工厂，评估利润空间与资质。',
        image: 'assets/projects/shop-launch/step1-xuanpin.jpg'
      },
      {
        title: '铺货',
        desc: '使用一键铺货工具（如逸淘），完成多平台商品信息同步与密文配置。',
        image: 'assets/projects/shop-launch/step2-puhuo.jpg'
      },
      {
        title: '上架',
        desc: '优化商品主图与标题，完成 SKU、价格及库存的抖店 / 千牛后台配置。',
        image: 'assets/projects/shop-launch/step3-shangjia.jpg'
      },
      {
        title: '客服',
        desc: '配置店小蜜自动回复策略与售前接待话术，提升响应速度。',
        image: 'assets/projects/shop-launch/step4-kefu.jpg'
      },
      {
        title: '推广',
        desc: '搭建千川 / 直通车推广计划，进行人群定向与手动出价设置。',
        image: 'assets/projects/shop-launch/step5-tuiguang.png'
      }
    ],
    background:
      '新锐品牌首次进入平台开设店铺，无自然流量基础、无历史成交数据，需要在 3 个月内完成店铺基建并跑通“流量 — 转化 — 复购”闭环。',
    solution: [
      '完成店铺定位与视觉体系搭建，统一首页、详情页与活动页的设计语言',
      '规划 3 层货盘结构（引流款 / 主推款 / 利润款），制定阶梯定价策略',
      '报名平台活动节点，配合短视频种草为店铺引流，跑通首单转化路径',
      '搭建会员与私域沉淀机制，通过包裹卡与客服 SOP 提升复购'
    ],
    competitorAnalysis: {
      title: '手机壳类目竞品深度分析',
      tools: ['生意参谋', '蝉妈妈', '巨量算数', '淘宝搜索页公开数据'],
      insights: [
        {
          title: '揭秘类目分层真相',
          desc: '并非按价格分层，而是按「上新强度」（月上新 / 在售款）分层。小店必须走少款快迭代，将上新强度拉到 30% 以上。'
        },
        {
          title: '挖掘同价位信任成本',
          desc: '9.9-25.9 元价格带已被强敌覆盖。我通过拆解标杆发现，破局点在「证据」：通过防摔实测视频建立买家信任。'
        },
        {
          title: '确立精准对标对象',
          desc: '设定「重叠度 × 体量」威胁评级，锁定唯一正面对标竞品（闪魔），主销定价卡位 12.9-19.9 元，实施差异化打击。'
        }
      ]
    },
    results: [
      { value: '约 +120%', label: '店铺 GMV 同比增长' },
      { value: '3 个月', label: '完成从 0 到稳定日销的冷启动' },
      { value: '约 +25%', label: '老客复购率提升' }
    ],
    images: [
      'assets/images/projects/cover-shop.webp'
    ],
    video: '',
    link: '#',
    confidential: true,
    confidentialNote: '店铺名称与经营数据已脱敏，展示数据为区间值。'
  },
  {
    id: 'content-creation',
    title: '新媒体账号内容创作与剪辑作品集',
    category: 'content',
    categoryLabel: '内容创作',
    filter: 'ai',
    role: '内容策划 / 剪辑',
    period: '2023.01 — 至今',
    summary: '负责账号选题策划、脚本撰写与视频剪辑，多条内容成为账号流量峰值作品。',
    background:
      '账号处于冷启动阶段，内容方向不清晰，更新节奏不稳定，需要通过数据验证找到可持续的内容模型。',
    solution: [
      '建立选题库，按“干货 / 场景 / 热点”三类规划内容排期',
      '统一封面与开头 3 秒钩子模板，提升完播率',
      '按周复盘播放与转化数据，快速迭代内容方向',
      '沉淀剪辑 SOP 与素材库，缩短单条视频制作周期'
    ],
    results: [
      { value: 'XX+ 条', label: '累计发布短视频内容' },
      { value: '约 +60%', label: '平均完播率提升' },
      { value: '多条', label: '内容成为账号流量峰值作品' }
    ],
    images: [
      'assets/images/projects/content-01.webp',
      'assets/images/projects/content-02.webp',
      'assets/images/projects/content-03.webp'
    ],
    video: '',
    link: '#',
    confidential: false,
    confidentialNote: ''
  }
];
