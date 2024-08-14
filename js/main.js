document.addEventListener('DOMContentLoaded', function() {
    const cityNameElement = document.getElementById('cityName');
    let cityNameTimeout;

    function showCityName(cityName) {
        cityNameElement.textContent = cityName;
        cityNameElement.style.opacity = '1';
        clearTimeout(cityNameTimeout);
        cityNameTimeout = setTimeout(() => {
            cityNameElement.style.opacity = '0';
        }, 500);
    }

    function loadAndAnimateImages() {
        config.folders.forEach(folder => {
            const usedIndices = new Set();
            for (let i = 0; i < config.imagesPerFolder; i++) {
                // Existing image creation code...

                imgContainer.addEventListener('mouseover', function() {
                    let cityName = '';
                    switch (folder) {
                        case 'B':
                            cityName = 'BANGKOK';
                            break;
                        case 'T':
                            cityName = 'TAIPEI';
                            break;
                        case 'L':
                            cityName = 'LOS ANGELES';
                            break;
                    }
                    showCityName(cityName);
                });

                // Existing click event listener...
            }
        });
    }


    const config = {
        basePath: 'images/gen/', // Base path
        folders: ['B', 'T', 'L'], // Subfolders
        imagesPerFolder: 3, // Images to select from each folder
        imageCount: 20, // Total images in each folder
        fileExtension: 'png' // File extension
    };

    const imagesContainer = document.getElementById('imagesContainer');
    if (!imagesContainer) {
        console.error('Images container not found!');
        return;
    }

    let speedMultiplier = 1;

    function getRandomPosition() {
        return {
            x: Math.random() * window.innerWidth - window.innerWidth / 3,
            y: Math.random() * window.innerHeight - window.innerHeight / 3
        };
    }

    function getRandomImage(folder, usedIndices) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * config.imageCount) + 1;
        } while (usedIndices.has(randomIndex));

        usedIndices.add(randomIndex);
        const paddedIndex = randomIndex.toString().padStart(2, '0');
        return `${config.basePath}${folder}/${folder}-${paddedIndex}.${config.fileExtension}`;
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

    function loaderAnimation() {
        var loader = document.querySelector("#loader");
        setTimeout(function () {
            loader.style.opacity = "0";
            setTimeout(function() {
                loader.style.display = "none";
            }, 700); // 等待過渡效果完成
        }, 3000);  // 更新為 6 秒（3秒動畫 * 2次重複）
    }
    loaderAnimation();

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
                    imgDiv.appendChild(img);
                    imgContainer.appendChild(imgDiv);

                    const startPos = getRandomPosition();
                    gsap.set(imgContainer, {
                        x: startPos.x,
                        y: startPos.y,
                        scale: 0.5 // Initial scale
                    });
                    moveImage(imgContainer);
                    imagesContainer.appendChild(imgContainer);
                };

                img.onerror = function() {
                    console.error('Failed to load image:', imageSrc);
                };

                imgContainer.addEventListener('click', function() {
                    let targetUrl = '';
                    switch (folder) {
                        case 'B':
                            targetUrl = 'pages/B-database.html';
                            break;
                        case 'L':
                            targetUrl = 'pages/L-database.html';
                            break;
                        case 'T':
                            targetUrl = 'pages/T-database.html';
                            break;
                        default:
                            console.error('Unknown folder:', folder);
                            return;
                    }
                    window.location.href = targetUrl;
                });
            }
        });
    }

    loadAndAnimateImages();

    window.addEventListener('wheel', () => {
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
});