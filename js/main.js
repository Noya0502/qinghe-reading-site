/* ============================================================
   青禾 · 城市阅读生活节 —— 页面脚本
   学号：24003140406 / 姓名：胡国静 / 类名前缀：Hgj406
   说明：
   1. 指导书不要求交互与动画，本文件的交互（移动端导航、选项卡、
      表单校验）属于“补充”内容，均为渐进增强：禁用 JS 时页面主体
      内容与样式仍完整可读。
   2. 仅使用 class 选择器，不使用 id 选择器。
   ============================================================ */
(function () {
  'use strict';

  /* 标记 JS 可用，移动端导航才会收起为汉堡菜单 */
  document.documentElement.classList.add('Hgj406-js');

  /* ---------- 1. 移动端导航 ---------- */
  var header = document.querySelector('.Hgj406-header');
  var menuButton = document.querySelector('.Hgj406-menu');
  var nav = document.querySelector('.Hgj406-nav');

  function setMenu(open) {
    if (!nav || !menuButton) return;
    nav.classList.toggle('Hgj406-is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      setMenu(!nav.classList.contains('Hgj406-is-open'));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });

    document.addEventListener('click', function (event) {
      if (!header || !nav.classList.contains('Hgj406-is-open')) return;
      if (!header.contains(event.target)) setMenu(false);
    });

    if (window.matchMedia) {
      var desktop = window.matchMedia('(min-width: 821px)');
      var onChange = function (event) {
        if (event.matches) setMenu(false);
      };
      if (desktop.addEventListener) {
        desktop.addEventListener('change', onChange);
      } else if (desktop.addListener) {
        desktop.addListener(onChange);
      }
    }
  }

  /* ---------- 2. 活动分类选项卡 ---------- */
  var tabList = document.querySelector('.Hgj406-tabs__bar');
  var tabs = Array.prototype.slice.call(
    document.querySelectorAll('.Hgj406-tabs__tab')
  );

  function selectTab(index, moveFocus) {
    tabs.forEach(function (tab, i) {
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      var active = i === index;
      tab.classList.toggle('Hgj406-is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
      if (panel) {
        panel.classList.toggle('Hgj406-is-active', active);
        panel.hidden = !active;
      }
    });
    if (moveFocus && tabs[index]) tabs[index].focus();
  }

  if (tabList && tabs.length) {
    tabList.addEventListener('click', function (event) {
      var tab = event.target.closest('.Hgj406-tabs__tab');
      if (!tab) return;
      selectTab(tabs.indexOf(tab), false);
    });

    tabList.addEventListener('keydown', function (event) {
      var current = tabs.indexOf(event.target);
      if (current < 0) return;
      var next = null;
      if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== null) {
        event.preventDefault();
        selectTab(next, true);
      }
    });
  }

  /* ---------- 3. 报名表单校验（演示，不提交到服务器） ---------- */
  var form = document.querySelector('.Hgj406-form');
  var status = document.querySelector('.Hgj406-form__status');

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('Hgj406-is-error', 'Hgj406-is-success');
    if (type) status.classList.add('Hgj406-is-' + type);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = form.elements.name;
      var phone = form.elements.phone;
      var session = form.elements.session;
      var agree = form.elements.agree;

      if (!name.value.trim()) {
        setStatus('请填写姓名。', 'error');
        name.focus();
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(phone.value.trim())) {
        setStatus('请填写正确的 11 位手机号码。', 'error');
        phone.focus();
        return;
      }
      if (!session.value) {
        setStatus('请选择参与场次。', 'error');
        session.focus();
        return;
      }
      if (!agree.checked) {
        setStatus('请先阅读并勾选活动须知。', 'error');
        agree.focus();
        return;
      }

      var sessionText = session.options[session.selectedIndex].text;
      setStatus(
        '预约成功（演示）：' + name.value.trim() + '，' + sessionText + '。信息未上传服务器。',
        'success'
      );
      form.reset();
    });

    form.addEventListener('input', function () {
      setStatus('', null);
    });
  }

  /* ---------- 4. 页脚年份 ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
