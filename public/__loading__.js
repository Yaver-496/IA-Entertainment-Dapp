pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';
        splash.style.display = 'block';

        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var circle = document.createElement('div');
        circle.id = 'progress-circle';
        container.appendChild(circle);

        var topHalf = document.createElement('div');
        topHalf.id = 'top-half';
        circle.appendChild(topHalf);

        var bottomHalf = document.createElement('div');
        bottomHalf.id = 'bottom-half';
        circle.appendChild(bottomHalf);

        var mask = document.createElement('div');
        mask.id = 'mask';
        circle.appendChild(mask);
    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        if (splash) {
            splash.parentElement.removeChild(splash);
        }
    };

    var setProgress = function (value) {
        var topHalf = document.getElementById('top-half');
        var bottomHalf = document.getElementById('bottom-half');
        var mask = document.getElementById('mask');
        if (topHalf && bottomHalf && mask) {
            value = Math.min(1, Math.max(0, value));
            var angle = (value * 180);

            // Change color to blue when progress starts
            topHalf.style.backgroundColor = value === 0 ? '#00d0ff' : '#6565d1';
            bottomHalf.style.backgroundColor = value === 0 ? '#00d0ff' : '#8686ff';

            if (angle <= 180) {
                topHalf.style.transform = 'rotate(' + angle + 'deg)';
                bottomHalf.style.transform = 'rotate(0deg)';
                mask.style.opacity = 0;
            } else {
                topHalf.style.transform = 'rotate(180deg)';
                bottomHalf.style.transform = 'rotate(' + (angle - 180) + 'deg)';
                mask.style.opacity = 1;
            }
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '    background-color: #283538;',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background-color: #283538;',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(50% - 64px);',
            '    left: calc(50% - 64px);',
            '    text-align: center;',
            '}',
            '',
            '#progress-bar-container {',
            '    position: relative;',
            '    width: 128px;',
            '    height: 128px;',
            '}',
            '',
            '#progress-circle {',
            '    width: 100%;',
            '    height: 100%;',
            '    position: relative;',
            '    border-radius: 50%;',
            '}',
            '',
            '#top-half, #bottom-half {',
            '    width: 100%;',
            '    height: 100%;',
            '    position: absolute;',
            '    clip: rect(0, 128px, 64px, 0);',
            '    border-radius: 50%;',
            '    background-color: #283538;', // Initially set to background color
            '}',
            '',
            '#top-half {',
            '    transform: rotate(0deg);',
            '    transform-origin: 64px 64px;',
            '}',
            '',
            '#bottom-half {',
            '    transform: rotate(0deg);',
            '    transform-origin: 64px 64px;',
            '}',
            '',
            '#mask {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    width: 100%;',
            '    height: 100%;',
            '    border-radius: 50%;',
            '    background-color: #283538;',
            '    clip: rect(64px, 128px, 128px, 0);',
            '    opacity: 0;',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        top: calc(50% - 42px);',
            '        left: calc(50% - 42px);',
            '    }',
            '    #progress-bar-container {',
            '        width: 84px;',
            '        height: 84px;',
            '    }',
            '    #top-half, #bottom-half {',
            '        clip: rect(0, 84px, 42px, 0);',
            '    }',
            '    #mask {',
            '        clip: rect(42px, 84px, 84px, 0);',
            '    }',
            '}'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };

    createCss();
    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress', setProgress);
        hideSplash();
    });
    app.on('preload:progress', setProgress);
});
