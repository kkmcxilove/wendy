/* ==========================================================================
   陈婉丽 · 电商运营个人网站 —— 交互逻辑
   模块：主题 / 导航 / 滚动动画 / 数字计数 / 项目渲染与筛选 / 模态框 /
        电话防抓取 / 表单 / 回到顶部 / 中英文切换(预留)
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
   * 1. 主题切换（默认深色，localStorage 记忆）
   * ------------------------------------------------------------------ */
  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch (e) { /* 隐私模式等场景忽略 */ }

    var theme = stored || document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(theme);

    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
          localStorage.setItem('theme', next);
        } catch (e) { /* ignore */ }
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题');
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0f1115' : '#fafbfc');
    }
  }

  /* ------------------------------------------------------------------
   * 2. 导航：锚点高亮 + 移动端汉堡菜单
   * ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('open', !expanded);
      });

      // 点击菜单项后收起（移动端）
      menu.addEventListener('click', function (e) {
        if (e.target.closest('.nav-link')) {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('open');
        }
      });
    }

    // 滚动时高亮当前区块
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var sections = links
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      sections.forEach(function (sec) { observer.observe(sec); });
    }
  }

  /* ------------------------------------------------------------------
   * 3. 滚动入场动画（IntersectionObserver，尊重 prefers-reduced-motion）
   * ------------------------------------------------------------------ */
  function initScrollReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------
   * 4. 核心数据计数动画
   *    用法：<span class="stat-num" data-target="120" data-prefix="约 "
   *          data-suffix="%" data-decimals="0">0</span>
   * ------------------------------------------------------------------ */
  function initCounters() {
    var nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;

    function render(el, val) {
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = prefix + val.toFixed(decimals) + suffix;
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      nums.forEach(function (el) {
        render(el, parseFloat(el.getAttribute('data-target')));
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);
        var target = parseFloat(el.getAttribute('data-target'));
        var duration = 1000;
        var start = null;

        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          // easeOutCubic
          var eased = 1 - Math.pow(1 - progress, 3);
          render(el, target * eased);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });

    nums.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------
   * 4.5 技能卡片聚光灯：鼠标位置写入 CSS 变量 --mx / --my
   * ------------------------------------------------------------------ */
  function initSpotlight() {
    var cards = document.querySelectorAll('.skill-card.spotlight');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var raf = null;
      var lastX = 0;
      var lastY = 0;

      card.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        lastX = e.clientX;
        lastY = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', (lastX - rect.left).toFixed(0) + 'px');
          card.style.setProperty('--my', (lastY - rect.top).toFixed(0) + 'px');
          raf = null;
        });
      });

      card.addEventListener('pointerleave', function () {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }

  /* ------------------------------------------------------------------
   * 5. 项目卡片渲染 + 分类筛选
   * ------------------------------------------------------------------ */
  var CATEGORY_LABELS = {
    all: '全部',
    shop: '店铺运营',
    competitor: '竞品分析',
    livestream: '直播运营',
    qianchuan: '千川优化',
    content: '内容创作'
  };

  function renderProjects() {
    var grid = document.getElementById('projectsGrid');
    if (!grid || !window.PROJECTS) return;

    grid.innerHTML = window.PROJECTS.map(function (p) {
      var cover = p.images && p.images[0] ? p.images[0] : '';
      var badge = p.confidential
        ? '<span class="confidential-badge">' + iconLock() + '已脱敏</span>'
        : '<span></span>';
      return (
        '<article class="project-card reveal visible" data-category="' + p.category + '"' +
        ' data-filter="' + (p.filter || p.category) + '"' +
        ' data-id="' + p.id + '" tabindex="0" role="button"' +
        ' aria-haspopup="dialog" aria-label="查看项目详情：' + escapeHtml(p.title) + '">' +
          '<div class="project-media">' +
            '<img src="' + cover + '" alt="' + escapeHtml(p.title) + '项目封面" loading="lazy" decoding="async">' +
          '</div>' +
          '<div class="project-body">' +
            '<span class="project-chip">' + escapeHtml(p.categoryLabel) + '</span>' +
            '<h3 class="project-title">' + escapeHtml(p.title) + '</h3>' +
            '<p class="project-meta">' + escapeHtml(p.role) + ' · ' + escapeHtml(p.period) + '</p>' +
            '<p class="project-summary">' + escapeHtml(p.summary) + '</p>' +
            '<div class="project-foot">' +
              '<span class="project-more">查看详情' + iconArrow() + '</span>' +
              badge +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function initFilter() {
    var tabs = document.querySelectorAll('.filter-tab');
    var grid = document.getElementById('projectsGrid');
    if (!tabs.length || !grid) return;

    function applyFilter(cat, animate) {
      // 「店铺运营」「运投一体」「AI 内容创作」都是页面内长排版，不是卡片列表
      var isShop = cat === 'shop';
      var isIntegrated = cat === 'integrated';
      var isAi = cat === 'ai';

      function toggleBand(band, show) {
        if (!band) return;
        band.classList.toggle('is-hidden', !show);
        if (show) {
          band.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('visible');
          });
        }
      }

      toggleBand(document.getElementById('shop-band'), isShop);
      toggleBand(document.getElementById('integrated-loop'), isIntegrated);
      toggleBand(document.getElementById('ai-works'), isAi);

      grid.classList.toggle('is-hidden', isShop || isIntegrated || isAi);

      var cards = grid.querySelectorAll('.project-card');
      cards.forEach(function (card) {
        var show =
          cat === 'all' || card.getAttribute('data-filter') === cat;
        card.classList.toggle('filter-hide', !show);
        if (show && animate) {
          // 重新触发淡入
          card.classList.remove('visible');
          void card.offsetWidth;
          card.classList.add('visible');
        }
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', String(t === tab));
        });
        applyFilter(tab.getAttribute('data-filter'), true);
      });
    });

    // 首次渲染按当前选中标签应用筛选
    var activeTab = document.querySelector('.filter-tab.active');
    if (activeTab) applyFilter(activeTab.getAttribute('data-filter'), false);
  }

  /* ------------------------------------------------------------------
   * 6. 项目详情模态框
   * ------------------------------------------------------------------ */
  var lastFocusedElement = null;

  function initModal() {
    var modal = document.getElementById('projectModal');
    var grid = document.getElementById('projectsGrid');
    if (!modal || !grid) return;

    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.project-card');
      if (card) openModal(card.getAttribute('data-id'));
    });
    grid.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('project-card')) {
        e.preventDefault();
        openModal(e.target.getAttribute('data-id'));
      }
    });

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'Tab') {
        trapFocus(modal, e);
      }
    });
  }

  function openModal(id) {
    var p = (window.PROJECTS || []).find(function (item) { return item.id === id; });
    var modal = document.getElementById('projectModal');
    if (!p || !modal) return;

    lastFocusedElement = document.activeElement;

    var mediaHtml = '';
    if (p.video) {
      mediaHtml =
        '<div class="modal-media"><video controls preload="none" playsinline' +
        (p.images && p.images[0] ? ' poster="' + p.images[0] + '"' : '') +
        '><source src="' + p.video + '" type="video/mp4">您的浏览器不支持视频播放。</video></div>';
    } else if (p.images && p.images[0]) {
      mediaHtml =
        '<div class="modal-media"><img src="' + p.images[0] + '" alt="' +
        escapeHtml(p.title) + '项目展示图 1"></div>';
    }

    // 多图项目：首图之后追加缩略图网格
    if (!p.video && p.images && p.images.length > 1) {
      mediaHtml += '<div class="modal-gallery">' +
        p.images.slice(1).map(function (src, i) {
          return '<img src="' + src + '" alt="' + escapeHtml(p.title) + '项目展示图 ' + (i + 2) + '" loading="lazy" decoding="async">';
        }).join('') +
        '</div>';
    }

    var resultsHtml = (p.results || []).map(function (r) {
      return (
        '<div class="modal-result">' +
          '<div class="modal-result-value">' + escapeHtml(r.value) + '</div>' +
          '<div class="modal-result-label">' + escapeHtml(r.label) + '</div>' +
        '</div>'
      );
    }).join('');

    // 步骤流渲染（交替图文）
    var stepsHtml = '';
    if (p.steps && p.steps.length) {
      stepsHtml = '<div class="modal-section">' +
        '<h3 class="modal-section-title">业务流程</h3>' +
        '<ol class="modal-steps">' +
        p.steps.map(function (s, i) {
          var side = i % 2 === 0 ? 'modal-step-left' : 'modal-step-right';
          return (
            '<li class="modal-step ' + side + '">' +
              '<div class="modal-step-media">' +
                '<img src="' + s.image + '" alt="' + escapeHtml(s.title) + '步骤截图" loading="lazy" decoding="async">' +
              '</div>' +
              '<div class="modal-step-body">' +
                '<div class="modal-step-num">' + (i + 1) + '</div>' +
                '<h4 class="modal-step-title">' + escapeHtml(s.title) + '</h4>' +
                '<p class="modal-step-desc">' + escapeHtml(s.desc) + '</p>' +
              '</div>' +
            '</li>'
          );
        }).join('') +
        '</ol>' +
      '</div>';
    }

    var noticeHtml = p.confidential
      ? '<div class="modal-notice">' + iconLock() +
        '<span>保密说明：' + escapeHtml(p.confidentialNote || '本项目涉及商业机密，关键信息已脱敏。') + '</span></div>'
      : '';

    var linkHtml = p.link && p.link !== '#'
      ? '<a class="btn btn-primary" href="' + p.link + '" target="_blank" rel="noopener noreferrer">访问项目' + iconArrow() + '</a>'
      : '';

    var subtitleHtml = p.subtitle
      ? '<p class="modal-subtitle">' + escapeHtml(p.subtitle) + '</p>'
      : '';
    var overviewHtml = p.overview
      ? '<p class="modal-overview">' + escapeHtml(p.overview) + '</p>'
      : '';

    // 竞品分析（工具标签 + 3 洞察卡片）
    var competitorHtml = '';
    if (p.competitorAnalysis) {
      var ca = p.competitorAnalysis;
      var toolsHtml = (ca.tools || []).map(function (t) {
        return '<span class="ca-tool">' + escapeHtml(t) + '</span>';
      }).join('');
      var insightsHtml = (ca.insights || []).map(function (ins) {
        return (
          '<div class="ca-insight">' +
            '<h4 class="ca-insight-title">' + escapeHtml(ins.title) + '</h4>' +
            '<p class="ca-insight-desc">' + escapeHtml(ins.desc) + '</p>' +
          '</div>'
        );
      }).join('');
      competitorHtml =
        '<div class="modal-section">' +
          '<h3 class="modal-section-title">' + escapeHtml(ca.title || '竞品深度分析') + '</h3>' +
          '<div class="ca-tools">' +
            '<span class="ca-tools-label">数据来源</span>' +
            toolsHtml +
          '</div>' +
          '<div class="ca-insights">' + insightsHtml + '</div>' +
        '</div>';
    }

    document.getElementById('modalContent').innerHTML =
      mediaHtml +
      '<div class="modal-head">' +
        '<h2 class="modal-title" id="modalTitle">' + escapeHtml(p.title) + '</h2>' +
        subtitleHtml +
        '<div class="modal-meta">' +
          '<span class="project-chip">' + escapeHtml(p.categoryLabel) + '</span>' +
          '<span>' + escapeHtml(p.role) + '</span>' +
          '<span>·</span>' +
          '<span>' + escapeHtml(p.period) + '</span>' +
        '</div>' +
      '</div>' +
      overviewHtml +
      '<div class="modal-section">' +
        '<h3 class="modal-section-title">项目背景 / 挑战</h3>' +
        '<p>' + escapeHtml(p.background) + '</p>' +
      '</div>' +
      stepsHtml +
      competitorHtml +
      (!stepsHtml && !competitorHtml ?
        '<div class="modal-section">' +
          '<h3 class="modal-section-title">方案 / 执行</h3>' +
          '<ul class="modal-list">' +
            (p.solution || []).map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') +
          '</ul>' +
        '</div>' : '') +
      '<div class="modal-section">' +
        '<h3 class="modal-section-title">成果数据</h3>' +
        '<div class="modal-results">' + resultsHtml + '</div>' +
      '</div>' +
      noticeHtml +
      '<div class="modal-actions">' + linkHtml + '</div>';

    modal.hidden = false;
    // 强制重排后加 open 类触发动画
    void modal.offsetWidth;
    modal.classList.add('open');
    document.body.classList.add('modal-locked');
    modal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    var modal = document.getElementById('projectModal');
    if (!modal || modal.hidden) return;

    if (prefersReducedMotion) {
      finishClose(modal);
      return;
    }
    modal.classList.add('closing');
    modal.classList.remove('open');
    setTimeout(function () { finishClose(modal); }, 260);
  }

  function finishClose(modal) {
    modal.classList.remove('closing');
    modal.hidden = true;
    document.body.classList.remove('modal-locked');
    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  }

  function trapFocus(modal, e) {
    var focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, video[controls], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ------------------------------------------------------------------
   * 8. （联系表单已移除，联系方式改为卡片直连）
   * ------------------------------------------------------------------ */


  /* ------------------------------------------------------------------
   * 9. 回到顶部
   * ------------------------------------------------------------------ */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle('show', window.scrollY > 600);
        ticking = false;
      });
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
   * 10. 中英文切换（预留结构，未翻译的内容回退中文）
   *     扩展方式：给元素加 data-i18n="key"，在下方 I18N.en 中补译文。
   * ------------------------------------------------------------------ */
  var I18N = {
    en: {
      // 示例：'nav.home': 'Home'
      // 未填写译文的 key 会自动回退为中文原文，无需完整翻译。
    }
  };

  function initI18n() {
    var btn = document.getElementById('langToggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var html = document.documentElement;
      var toEn = html.getAttribute('lang') !== 'en';
      html.setAttribute('lang', toEn ? 'en' : 'zh-CN');
      btn.textContent = toEn ? '中' : 'EN';

      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (toEn) {
          // 首次切换时缓存中文原文
          if (!el.hasAttribute('data-i18n-zh')) {
            el.setAttribute('data-i18n-zh', el.textContent);
          }
          // 有译文用译文，无译文回退中文
          el.textContent = (I18N.en && I18N.en[key]) || el.getAttribute('data-i18n-zh');
        } else if (el.hasAttribute('data-i18n-zh')) {
          el.textContent = el.getAttribute('data-i18n-zh');
        }
      });
    });
  }

  /* ------------------------------------------------------------------
   * 工具函数
   * ------------------------------------------------------------------ */
  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function iconArrow() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }

  function iconLock() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  }

  /* ------------------------------------------------------------------
   * AI 商业视频：居中播放按钮
   * 原生 controls 在不同浏览器里点击行为不一致，这里加一个
   * 明确的播放按钮，点击一定触发 play()，播放后再隐藏。
   * ------------------------------------------------------------------ */
  function initVideoPlayers() {
    document.querySelectorAll('.ai-video-frame').forEach(function (frame) {
      var video = frame.querySelector('video');
      var btn = frame.querySelector('.ai-video-play');
      if (!video || !btn) return;

      function hideBtn() { btn.hidden = true; }
      function showBtn() { btn.hidden = false; }

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () { /* 忽略自动播放限制或加载中断 */ });
        }
      });

      video.addEventListener('play', hideBtn);
      video.addEventListener('pause', function () {
        if (!video.ended) showBtn();
      });
      video.addEventListener('ended', showBtn);
      video.addEventListener('error', showBtn);
    });
  }

  /* ------------------------------------------------------------------
   * Workflow 视频弹窗：点击 .wf-media → 全屏黑色遮罩 + 视频
   * ------------------------------------------------------------------ */
  function initWfVideoModal() {
    var modal = document.getElementById('wfVideoModal');
    if (!modal) return;
    var panel = modal.querySelector('.wf-modal-panel');
    var backdrop = modal.querySelector('.wf-modal-backdrop');
    var closeBtn = modal.querySelector('.wf-modal-close');
    var videoEl = modal.querySelector('video');
    if (!panel || !backdrop || !closeBtn || !videoEl) return;

    var lastFocus = null;
    var transitionDone = false;

    function lockBody() {
      var scrollY = window.scrollY;
      document.body.dataset.wfScroll = scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = -scrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    }
    function unlockBody() {
      var y = parseInt(document.body.dataset.wfScroll || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      try { window.scrollTo(0, y); } catch (e) {}
    }

    function open(src, poster) {
      lastFocus = document.activeElement;

      // 注入视频源（每次打开都重新设置，避免浏览器缓存旧 src 时 reload 状态混乱）
      videoEl.innerHTML = '';
      var s = document.createElement('source');
      s.src = src;
      s.type = 'video/mp4';
      videoEl.appendChild(s);
      if (poster) videoEl.poster = poster; else videoEl.removeAttribute('poster');
      videoEl.load();

      modal.hidden = false;
      transitionDone = false;
      // 两段式打开：先让元素参与布局，再下一帧加类触发过渡
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          modal.classList.add('is-open');
          lockBody();
          closeBtn.focus({ preventScroll: true });
          // 自动开始播放（静音也可以，让弹窗显得生动）
          var p = videoEl.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        });
      });
    }

    function close() {
      if (modal.hidden) return;
      transitionDone = false;
      modal.classList.remove('is-open');
      unlockBody();
      videoEl.pause();
      videoEl.currentTime = 0;
      // 过渡结束后再隐藏 DOM（display:none 会打断 transition）
      var cleanup = function () {
        if (transitionDone) return;
        transitionDone = true;
        modal.hidden = true;
        videoEl.innerHTML = '';
        videoEl.removeAttribute('poster');
        if (lastFocus && typeof lastFocus.focus === 'function') {
          lastFocus.focus({ preventScroll: true });
        }
      };
      panel.addEventListener('transitionend', cleanup, { once: true });
      backdrop.addEventListener('transitionend', cleanup, { once: true });
      // 兜底：万一 transitionend 没触发
      setTimeout(cleanup, 500);
    }

    // 事件委托：点击任何 .wf-media 按钮 或 .wf-media-trigger 按钮都能触发
    var triggerSelector = '.wf-media, .wf-media-trigger';
    document.addEventListener('click', function (e) {
      var btn = e.target.closest(triggerSelector);
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      open(btn.getAttribute('data-video'), btn.getAttribute('data-poster'));
    });
    // 键盘 Enter / Space
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && (e.target.classList.contains('wf-media') || e.target.classList.contains('wf-media-trigger'))) {
        e.preventDefault();
        open(e.target.getAttribute('data-video'), e.target.getAttribute('data-poster'));
      }
    });

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    // ESC 关闭 + 键盘焦点锁定（简单版）
    document.addEventListener('keydown', function (e) {
      if (modal.hidden || !modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        // 仅限制在弹窗内
        var focusables = modal.querySelectorAll('button, [href], video, [tabindex]');
        focusables = Array.prototype.filter.call(focusables, function (f) {
          return !f.disabled && f.getAttribute('tabindex') !== '-1';
        });
        if (focusables.length === 0) { e.preventDefault(); return; }
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }

  /* ------------------------------------------------------------------
   * Hero 照片轮播（原生 JS · 淡入淡出 · 自动播放 · 圆点切换）
   * ------------------------------------------------------------------ */
  function initHeroCarousel() {
    var root = document.querySelector('.hero-carousel');
    if (!root) return;
    var slides = root.querySelectorAll('.hero-carousel-slide');
    var dotsBox = root.querySelector('.hero-carousel-dots');
    if (!slides.length || !dotsBox) return;

    var total = slides.length;
    var current = 0;
    var timer = null;
    var AUTOPLAY_MS = 4200;

    // 生成圆点
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'hero-carousel-dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', '切换到第 ' + (i + 1) + ' 张照片');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) dot.classList.add('is-active');
      (function (idx) {
        dot.addEventListener('click', function () {
          go(idx);
          restart();
        });
      })(i);
      dotsBox.appendChild(dot);
    }
    var dots = dotsBox.querySelectorAll('.hero-carousel-dot');

    function go(idx) {
      if (idx === current) return;
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');
      current = idx;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    function next() { go((current + 1) % total); }

    function start() { timer = setInterval(next, AUTOPLAY_MS); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    // 鼠标悬停暂停
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    // 触摸设备：触摸时暂停
    root.addEventListener('touchstart', stop, { passive: true });
    root.addEventListener('touchend', start);

    start();
  }

  /* ------------------------------------------------------------------
   * 启动
   * ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    renderProjects();   // 先渲染卡片，再做动画与筛选绑定
    initNav();
    initScrollReveal();
    initCounters();
    initSpotlight();
    initFilter();
    initModal();
    initBackToTop();
    initI18n();
    initVideoPlayers();
    initWfVideoModal();
    initHeroCarousel();
  });
})();
