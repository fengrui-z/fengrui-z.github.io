/**
 * Terminal Simulator for Geek Homepage
 * Interactive command-line interface
 */

class TerminalSimulator {
    constructor(container) {
        this.container = container;
        this.history = [];
        this.historyIndex = -1;
        this.commands = this.registerCommands();
        this.init();
    }

    registerCommands() {
        return {
            'help': {
                description: 'Show available commands',
                execute: () => this.showHelp()
            },
            'about': {
                description: 'About me',
                execute: () => this.showAbout()
            },
            'updates': {
                description: 'Latest updates & news',
                execute: () => this.showUpdates()
            },
            'projects': {
                description: 'My projects & research',
                execute: () => this.showProjects()
            },
            'skills': {
                description: 'Technical skills',
                execute: () => this.showSkills()
            },
            'contact': {
                description: 'Contact information',
                execute: () => this.showContact()
            },
            'links': {
                description: 'Useful links',
                execute: () => this.showLinks()
            },
            'clear': {
                description: 'Clear terminal',
                execute: () => this.clearTerminal()
            },
            'date': {
                description: 'Show current date',
                execute: () => this.showDate()
            },
            'whoami': {
                description: 'Who am I?',
                execute: () => this.showWhoami()
            },
            'neofetch': {
                description: 'System info (fun)',
                execute: () => this.showNeofetch()
            },
            'sudo': {
                description: 'Try it... ( Easter egg)',
                execute: (args) => this.sudoEasterEgg(args)
            },
            'coffee': {
                description: 'Coffee break ☕',
                execute: () => this.makeCoffee()
            },
            'repo': {
                description: 'View this site source',
                execute: () => this.showRepo()
            },
            'ls': {
                description: 'List sections',
                execute: () => this.lsCommand()
            },
            'cat': {
                description: 'Read a file (try cat about)',
                execute: (args) => this.catCommand(args)
            },
            'theme': {
                description: 'Toggle dark/light theme',
                execute: () => this.toggleTheme()
            },
            'matrix': {
                description: 'Toggle matrix effect',
                execute: () => this.toggleMatrix()
            },
            'hack': {
                description: 'Easter egg 🎃',
                execute: () => this.hackEasterEgg()
            }
        };
    }

    init() {
        this.render();
        this.bindEvents();
        this.showWelcome();
    }

    render() {
        this.container.innerHTML = `
            <div class="terminal-window">
                <div class="terminal-body" id="terminal-output">
                </div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">
                        <span class="user">fengrui</span><span class="at">@</span><span class="host">homepage</span><span class="colon">:</span><span class="path">~</span>$
                    </span>
                    <input type="text" class="terminal-input" id="terminal-input" placeholder="type 'help' for commands..." autocomplete="off" autofocus>
                </div>
            </div>
        `;
        this.outputEl = this.container.querySelector('#terminal-output');
        this.inputEl = this.container.querySelector('#terminal-input');
    }

    bindEvents() {
        this.inputEl.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.inputEl.addEventListener('keyup', (e) => this.handleKeyup(e));

        // Focus input on click anywhere in terminal
        this.container.addEventListener('click', () => {
            this.inputEl.focus();
        });
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            this.executeCommand(this.inputEl.value.trim());
            this.inputEl.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete();
        } else if (e.key === 'c' && e.ctrlKey) {
            this.appendOutput('\n^C');
            this.inputEl.value = '';
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            this.clearTerminal();
        }
    }

    handleKeyup(e) {
        // Reserved for future use
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;

        this.historyIndex += direction;

        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            this.inputEl.value = '';
            return;
        }

        this.inputEl.value = this.history[this.historyIndex];
    }

    autoComplete() {
        const input = this.inputEl.value.trim();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));

        if (matches.length === 1) {
            this.inputEl.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.appendOutput(`\n${matches.join('  ')}\n`);
        }
    }

    executeCommand(input) {
        if (!input) return;

        this.history.push(input);
        this.historyIndex = this.history.length;

        // Show the command in output
        const prompt = `<span class="terminal-prompt"><span class="user">fengrui</span><span class="at">@</span><span class="host">homepage</span><span class="colon">:</span><span class="path">~</span>$</span>`;
        this.appendOutput(`${prompt} ${input}`);

        // Parse command and arguments
        const parts = input.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands[cmd]) {
            const result = this.commands[cmd].execute(args);
            if (result) {
                this.appendOutput(result);
            }
        } else {
            this.appendOutput(`<span class="error">Command not found: ${cmd}</span>\nType '<span class="highlight">help</span>' for available commands.`);
        }
    }

    appendOutput(content) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'terminal-output';
        outputDiv.innerHTML = content;
        this.outputEl.appendChild(outputDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    typewriterEffect(text, element, speed = 30) {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                this.scrollToBottom();
            } else {
                clearInterval(interval);
            }
        }, speed);
    }

    // Command implementations
    showWelcome() {
        const welcome = `
<span class="ascii-art">
███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ██╗   ██╗
████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗╚██╗ ██╔╝
██╔████╔██║█████╗  ██╔████╔██║██║   ██║██████╔╝ ╚████╔╝
██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██╔══██╗  ╚██╔╝
██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║  ██║   ██║
╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝
</span>
<span class="info">Welcome to Fengrui's Homepage Terminal v1.0.0</span>
Type '<span class="highlight">help</span>' to see available commands.
Try '<span class="highlight">neofetch</span>' for a fun system info display.
<span class="warning">[Tip]</span> Use <span class="success">Tab</span> for autocomplete, <span class="success">↑/↓</span> for history.
`;
        this.appendOutput(welcome);
    }

    showHelp() {
        return `
<div class="command-list">
<span class="info">Available Commands:</span>

<span class="command-item"><span class="command-name">about</span><span class="command-desc">About me & my background</span></span>
<span class="command-item"><span class="command-name">updates</span><span class="command-desc">Latest updates & news</span></span>
<span class="command-item"><span class="command-name">projects</span><span class="command-desc">My projects & research</span></span>
<span class="command-item"><span class="command-name">skills</span><span class="command-desc">Technical skills & expertise</span></span>
<span class="command-item"><span class="command-name">contact</span><span class="command-desc">How to reach me</span></span>
<span class="command-item"><span class="command-name">links</span><span class="command-desc">Useful links & resources</span></span>

<span class="command-item"><span class="command-name">neofetch</span><span class="command-desc">System info (fun display)</span></span>
<span class="command-item"><span class="command-name">date</span><span class="command-desc">Current date & time</span></span>
<span class="command-item"><span class="command-name">whoami</span><span class="command-desc">Who am I?</span></span>
<span class="command-item"><span class="command-name">ls</span><span class="command-desc">List sections</span></span>
<span class="command-item"><span class="command-name">cat [file]</span><span class="command-desc">Read a file (try cat about)</span></span>

<span class="command-item"><span class="command-name">clear</span><span class="command-desc">Clear terminal screen</span></span>
<span class="command-item"><span class="command-name">theme</span><span class="command-desc">Toggle dark/light theme</span></span>
<span class="command-item"><span class="command-name">matrix</span><span class="command-desc">Toggle matrix background</span></span>
<span class="command-item"><span class="command-name">repo</span><span class="command-desc">View this site's source code</span></span>

<span class="warning">[Easter Eggs]</span> Try: <span class="highlight">sudo</span>, <span class="highlight">coffee</span>, <span class="highlight">hack</span>
</div>`;
    }

    showAbout() {
        return `
<div class="terminal-profile">
<div class="terminal-avatar">🧑‍💻</div>
<div class="terminal-info">
<div class="name">Fengrui Zhang (张峰瑞)</div>
<div class="title">First-year CS Ph.D. Student @ Nanjing University</div>
<div class="links">
<a href="https://github.com/fengrui-z" target="_blank">GitHub ↗</a>
<a href="https://scholar.google.com/citations?user=qv13JgoAAAAJ" target="_blank">Scholar ↗</a>
</div>
</div>
</div>

<span class="info">Background:</span>
• First-year Computer Science Ph.D. Student at <span class="highlight">LANDS Lab</span>
• Nanjing University, supervised by Prof. <span class="highlight">Xiaoliang Wang</span>
• Research interests: Distributed Systems, Network Architecture

<span class="info">Education:</span>
• Ph.D. in CS, Nanjing University <span class="warning">(2025 - present)</span>
• B.S. in CS, Nanjing University <span class="success">(2021 - 2025)</span>`;
    }

    showUpdates() {
        return `
<span class="info">Latest Updates:</span>

<div class="terminal-timeline">
<div class="timeline-item">
<span class="timeline-date">2026.02</span>
<span class="timeline-content">Started internship at <span class="highlight">Tongyi Lab, Alibaba</span></span>
</div>
<div class="timeline-item">
<span class="timeline-date">2025.09</span>
<span class="timeline-content">Began Ph.D. journey at <span class="highlight">LANDS Lab, NJU</span></span>
</div>
<div class="timeline-item">
<span class="timeline-date">2025.06</span>
<span class="timeline-content">Graduated with B.S. from <span class="highlight">Nanjing University</span></span>
</div>
</div>

<span class="warning">[Note]</span> Check back for more updates!`;
    }

    showProjects() {
        return `
<span class="info">Projects & Research:</span>

<div class="projects-grid">
<div class="project-card">
<span class="project-name">Research @ LANDS</span>
<span class="project-desc">Distributed systems & network architecture research under Prof. Xiaoliang Wang</span>
</div>
<div class="project-card">
<span class="project-name">Internship @ Tongyi Lab</span>
<span class="project-desc">Working on LLM-related systems at Alibaba's Tongyi Lab (2026)</span>
</div>
</div>

<span class="warning">[More details coming soon...]</span>`;
    }

    showSkills() {
        return `
<span class="info">Technical Skills:</span>

<span class="success">Languages:</span>
<span class="skill-tag">Python</span><span class="skill-tag">C/C++</span><span class="skill-tag">Go</span><span class="skill-tag">Java</span><span class="skill-tag">Rust</span><span class="skill-tag">Bash</span>

<span class="success">Systems & Tools:</span>
<span class="skill-tag">Linux</span><span class="skill-tag">Docker</span><span class="skill-tag">Git</span><span class="skill-tag">Kubernetes</span><span class="skill-tag">MySQL</span><span class="skill-tag">Redis</span>

<span class="success">Research Areas:</span>
<span class="skill-tag">Distributed Systems</span><span class="skill-tag">Network Architecture</span><span class="skill-tag">LLM Systems</span>

<span class="warning">[Always learning new things...]</span>`;
    }

    showContact() {
        return `
<span class="info">Contact Information:</span>

<span class="success">Email:</span>    fengrui [at] nju [dot] edu [dot] cn
<span class="success">GitHub:</span>   <a href="https://github.com/fengrui-z" target="_blank">https://github.com/fengrui-z ↗</a>
<span class="success">Scholar:</span>  <a href="https://scholar.google.com/citations?user=qv13JgoAAAAJ" target="_blank">Google Scholar ↗</a>

<span class="warning">[Feel free to reach out!]</span>`;
    }

    showLinks() {
        return `
<span class="info">Useful Links:</span>

<span class="highlight">Lab:</span>     <a href="https://cs.nju.edu.cn/lands/people.html" target="_blank">LANDS Lab ↗</a>
<span class="highlight">School:</span>  <a href="https://cs.nju.edu.cn/" target="_blank">NJU CS ↗</a>
<span class="highlight">Blog:</span>    <a href="/blog">My Blog →</a>

<span class="warning">[More links on header navigation]</span>`;
    }

    clearTerminal() {
        this.outputEl.innerHTML = '';
        return null;
    }

    showDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        return `<span class="highlight">${now.toLocaleDateString('en-US', options)}</span>`;
    }

    showWhoami() {
        return `<span class="success">fengrui</span> - A CS Ph.D. student passionate about distributed systems and network architecture.`;
    }

    showNeofetch() {
        return `
<span class="ascii-art" style="font-size: 8px;">
       ██       ████████  ████████
      ███       ████████  ████████
     █████      ████████  ████████
    ███████     ████████  ████████
   █████████    ████████  ████████
  ███████████   ████████  ████████
 █████████████  ████████  ████████
███████████████ ████████  ████████
</span>
<span class="success">fengrui@homepage</span>
<span class="warning">-----------------</span>
<span class="highlight">OS:</span>       Homepage OS 1.0
<span class="highlight">Host:</span>     GitHub Pages
<span class="highlight">Kernel:</span>   Jekyll 4.x
<span class="highlight">Uptime:</span>   Since 2025
<span class="highlight">Shell:</span>    Terminal Simulator
<span class="highlight">Terminal:</span> Web Terminal v1.0
<span class="highlight">CPU:</span>     🧠 Brain (distributed systems focus)
<span class="highlight">Memory:</span>  📚 Research papers + code
<span class="highlight">Resolution:</span> Responsive
<span class="highlight">Theme:</span>   Geek Dark Mode
<span class="highlight">Icons:</span>   Nerd Fonts

<span class="warning">[Tip]</span> This is a fun approximation of neofetch!`;
    }

    sudoEasterEgg(args) {
        if (!args || args.length === 0) {
            return `<span class="error">sudo: no command specified</span>\n<span class="warning">[Hint]</span> sudo requires a password... but we don't have one here. 😄`;
        }

        const cmd = args.join(' ');
        if (cmd === 'make me a sandwich') {
            return `<span class="error">sudo make me a sandwich</span>\n<span class="success">Okay! 🥪 Here's your sandwich!</span>`;
        }
        return `<span class="error">sudo: ${cmd}: command not found</span>\n<span class="warning">[Easter egg]</span> Try "sudo make me a sandwich"`;
    }

    makeCoffee() {
        return `
<span class="ascii-art">
    ( (
     ) )
   ........
   |      |]
   \\      /
    \`----'
</span>
<span class="success">☕ Brewing coffee...</span>
<span class="info">Coffee is ready! Time for a break.</span>
<span class="warning">[Fun fact]</span> Researchers drink ~4 cups/day on average!`;
    }

    showRepo() {
        return `
<span class="info">This website's source code:</span>

<span class="highlight">Repository:</span>  <a href="https://github.com/fengrui-z/fengrui-z.github.io" target="_blank">github.com/fengrui-z/fengrui-z.github.io ↗</a>

<span class="success">Built with:</span>
<span class="skill-tag">Jekyll</span><span class="skill-tag">HTML/CSS</span><span class="skill-tag">JavaScript</span>

<span class="warning">[Feel free to fork and customize!]</span>`;
    }

    lsCommand() {
        return `
<span class="info">Available sections:</span>

<span class="success">drwxr-xr-x</span>  about/
<span class="success">drwxr-xr-x</span>  projects/
<span class="success">drwxr-xr-x</span>  updates/
<span class="success">drwxr-xr-x</span>  skills/
<span class="success">drwxr-xr-x</span>  contact/
<span class="success">drwxr-xr-x</span>  links/
<span class="warning">-r--r--r--</span>  README.md
<span class="warning">-r--r--r--</span>  CV.pdf

<span class="warning">[Tip]</span> Use <span class="highlight">cat about</span> to read section content`;
    }

    catCommand(args) {
        if (!args || args.length === 0) {
            return `<span class="error">cat: missing file argument</span>\n<span class="warning">Usage:</span> cat [section] - try "cat about"`;
        }

        const file = args[0].toLowerCase();
        const validFiles = ['about', 'updates', 'projects', 'skills', 'contact', 'links', 'readme', 'cv'];

        if (validFiles.includes(file)) {
            if (file === 'readme') {
                return `<span class="info">README.md:</span>\nWelcome to Fengrui's homepage! This is a terminal-style interactive interface. Type 'help' for commands.`;
            }
            if (file === 'cv') {
                return `<span class="info">CV.pdf:</span>\n<span class="warning">[Binary file - cannot display]</span>\nCheck out: <a href="/assets/resume.pdf" target="_blank">resume.pdf ↗</a>`;
            }
            // For other files, execute corresponding command
            if (this.commands[file]) {
                return this.commands[file].execute();
            }
        }

        return `<span class="error">cat: ${file}: No such file or directory</span>`;
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Sync with header toggle icons if available
        const iconMoon = document.getElementById('theme-icon-moon');
        const iconSun = document.getElementById('theme-icon-sun');
        if (iconMoon && iconSun) {
            if (newTheme === 'dark') {
                iconMoon.style.display = 'none';
                iconSun.style.display = 'block';
            } else {
                iconMoon.style.display = 'block';
                iconSun.style.display = 'none';
            }
        }

        return `<span class="success">Theme switched to ${newTheme} mode</span>`;
    }

    toggleMatrix() {
        const existingMatrix = document.querySelector('.matrix-bg');
        if (existingMatrix) {
            existingMatrix.remove();
            return `<span class="success">Matrix effect disabled</span>`;
        }

        // Create matrix rain effect
        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-bg';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#39d353';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const matrixInterval = setInterval(draw, 33);
        canvas.dataset.interval = matrixInterval;

        return `<span class="success">Matrix effect enabled</span>\n<span class="warning">[Type 'matrix' again to disable]</span>`;
    }

    hackEasterEgg() {
        return `
<span class="ascii-art">
    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    █ ▄▄▄▄▄ █▀▄▀▄█ ▄▄▄▄▄ █
    █ █   █ █▄ █ █ █   █ █
    █ █▄▄▄█ █ ▀ █ █ █▄▄▄█ █
    █▄▄▄▄▄▄▄█ █▄█ █▄▄▄▄▄▄▄█
    █  ▀  ▄▄▄▀▄█▀██▄▀▀█▀▀▄█
    █ █▀▀▀▀█▄▀█▀▀▄▄▄█▀█▀██
    █▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█
</span>
<span class="error">[ACCESS DENIED]</span>
<span class="warning">This isn't a real hacking tool, just a fun easter egg! 😄</span>
<span class="info">But if you're interested in security research, let's chat!</span>`;
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const terminalContainer = document.getElementById('terminal-container');
    if (terminalContainer) {
        new TerminalSimulator(terminalContainer);
    }
});