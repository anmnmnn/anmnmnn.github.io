document.addEventListener('DOMContentLoaded', function() {
    // 配置對象
    const config = {
        basePath: 'images/gen/', // 基礎路徑
        folders: ['B', 'T', 'L'], // 子資料夾
        imagesPerFolder: 3, // 每個資料夾要選擇的圖片數量
        imageCount: 20, // 每個資料夾中的總圖片數量
        fileExtension: 'png' // 文件擴展名
    };

    const imagesContainer = document.getElementById('imagesContainer');
    if (!imagesContainer) {
        console.error('Images container not found!');
        return;
    }

    let speedMultiplier = 1;

    function getRandomPosition() {
        return {
            x: Math.random() * window.innerWidth - window.innerWidth / 2,
            y: Math.random() * window.innerHeight - window.innerHeight / 2
        };
    }

    function getRandomImage(folder, usedIndices) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * config.imageCount) + 1;
        } while (usedIndices.has(randomIndex));

        usedIndices.add(randomIndex);
        const paddedIndex = randomIndex.toString().padStart(2, '0');
        const imagePath = `${config.basePath}${folder}/${folder}-${paddedIndex}.${config.fileExtension}`;
        console.log('Attempting to load image:', imagePath);
        return imagePath;
    }

    function moveImage(imgContainer) {
        if (imgContainer.dataset.paused === 'true') return;

        const endPos = getRandomPosition();
        gsap.to(imgContainer, {
            duration: (10 + Math.random() * 20) / speedMultiplier,
            x: endPos.x,
            y: endPos.y,
            ease: "power1.inOut",
            onComplete: () => moveImage(imgContainer)
        });
    }

    function loadAndAnimateImages() {
        config.folders.forEach(folder => {
            const usedIndices = new Set();
            for (let i = 0; i < config.imagesPerFolder; i++) {
                const imageSrc = getRandomImage(folder, usedIndices);
                
                const imgContainer = document.createElement('div');
                imgContainer.className = `floating-image-container ${folder}-image`;
                imgContainer.dataset.paused = 'false';
                
                const imgDiv = document.createElement('div');
                imgDiv.className = 'floating-image';
                
                const img = new Image();
                img.src = imageSrc;
                img.alt = `Random Image from ${folder}`;
                
                img.onload = function() {
                    console.log('Image loaded successfully:', imageSrc);
                    imgDiv.appendChild(img);
                    imgContainer.appendChild(imgDiv);
                    
                    const startPos = getRandomPosition();
                    gsap.set(imgContainer, {
                        x: startPos.x,
                        y: startPos.y,
                        scale: 0.25 // 固定初始缩放比例
                    });
                    moveImage(imgContainer);
                    imagesContainer.appendChild(imgContainer);
                };
    
                img.onerror = function() {
                    console.error('Failed to load image:', imageSrc);
                };
    
                imgContainer.addEventListener('mouseenter', function() {
                    this.dataset.paused = 'true';
                    gsap.killTweensOf(this);
                    gsap.to(this, { scale: 1.1 });
                    console.log('Image paused:', this);
                });
    
                imgContainer.addEventListener('mouseleave', function() {
                    this.dataset.paused = 'false';
                    gsap.to(this, { scale: 0.25 });
                    moveImage(this);
                    console.log('Image resumed:', this);
                });
                
                // 點擊事件處理器
                imgContainer.addEventListener('click', function() {
                    let targetUrl = '';
                    if (folder === 'B') {
                        targetUrl = 'pages/B-database.html';
                    } else if (folder === 'L') {
                        targetUrl = 'pages/L-database.html';
                    } else if (folder === 'T') {
                        targetUrl = 'pages/T-database.html';
                    }
                
                    console.log('Clicked folder:', folder);  // 調試輸出
                    console.log('Navigating to:', targetUrl);  // 調試輸出
                
                    if (targetUrl) {
                        window.location.href = targetUrl;
                    } else {
                        console.error('Target URL not set properly.');
                    }
                });
            }
        });
    }

    loadAndAnimateImages();

    window.addEventListener('wheel', (e) => {
        speedMultiplier = 3;
        setTimeout(() => {
            speedMultiplier = 1;
        }, 500);

        document.querySelectorAll('.floating-image-container').forEach((imgContainer) => {
            if (imgContainer.dataset.paused !== 'true') {
                gsap.getTweensOf(imgContainer).forEach(tween => {
                    let progress = tween.progress();
                    let newDuration = tween.duration() / 3;
                    tween.duration(newDuration).progress(progress);
                });
            }
        });
    });

    console.log('Script loaded and executed');
});
