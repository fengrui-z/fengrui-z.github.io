---
layout: page
title: Play
permalink: /play/
---

<style>
  /* 游戏容器样式，适配 Bear 风格 */
  .game-wrapper {
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    background: #222; /* 深色背景防止闪烁 */
  }
  .game-frame {
    width: 100%;
    height: 700px;
    border: none;
    display: block;
  }
</style>

### Ultimate Tic-Tac-Toe

这是一个基于局部策略的终极井字棋游戏。尝试击败 AI！

<div class="game-wrapper">
    <iframe 
      src="/assets/games/ten.html" 
      class="game-frame" 
      scrolling="no"
      title="Ultimate Tic-Tac-Toe">
    </iframe>
</div>

[返回首页](/)