(function () {
    window.addEventListener('load', () => {
        if (!window.Live2DApp) {
            console.error('Live2DApp 不可用。确保模块脚本已加载。');
            return;
        }
        // 初始化之前修改全局
        window.Live2DApp.setGlobalScale(1.1);
        window.Live2DApp.setModelArray.add("阿库露_vts");

        // 先初始化 Live2D 应用
        const initialized = window.Live2DApp.initialize();
        if (!initialized) {
            console.error('Live2D 应用初始化失败，停止后续操作');
            return;
        }
        window.Live2DApp.run();
        console.log('Live2D 应用已初始化');

        // 等待画布创建
        function waitForCanvas(callback) {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                console.log('找到画布!');
                callback(canvas);
            } else {
                console.log('未找到画布，正在等待...');
                setTimeout(() => waitForCanvas(callback), 100);
            }
        }

        waitForCanvas(async (canvas) => {
            // // 1. 设置画布位置
            // window.Live2DApp.setCanvasPosition(100, 100);
            // console.log('画布设置位置 top: 100, left: 100');

            // 2. 设置模型位置
            // window.Live2DApp.setModelPosition(-0.3, -0.4);
            console.log('模型设置位置 x: -0.3, y: -0.4');

            // // 3. 切换模型
            // try {
            //     window.Live2DApp.switchModel('../dist/Resources/Hiyori/', 'Hiyori.model3.json');
            // } catch (err) {
            //     console.error('切换模型失败', err);
            //     return;
            // }

            // 3.加载动作
            // try {
            //     window.Live2DApp.preLoadMotionGroup('Idle');
            //     console.error('加载动作成功', err);
            // } catch (err) {
            //     console.error('加载动作失败', err);
            //     return;
            // }

            // //测试
            // try {
            //     await window.Live2DApp.setGlobalScale(1.2);
            //     console.log('调整模大小 Ailin');
            // } catch (err) {
            //     console.error('切换模型失败', err);
            //     return;
            // }


            // 5. 动态播放动作
            const playNextMotion = () => {
                const handle = window.Live2DApp.playMotion(
                    'Idle',
                    0,
                    30,
                    () => {
                        console.log('空闲动作播放完了');
                        setTimeout(playNextMotion, 2000);
                    },
                    () => {
                        console.log('空闲动作开始播放');
                    }
                );

                if (handle === window.InvalidMotionQueueEntryHandleValue) {
                    console.error('空闲动作播放失败');
                    return;
                }
                console.log('播放动作');
            };
            // 确保动作加载完再播放
            setTimeout(playNextMotion, 1000); // 延时1秒，等待动作预加载
            window.Live2DApp.playAudio('../test_file/李冰冰.wav')
        });
    });
})();