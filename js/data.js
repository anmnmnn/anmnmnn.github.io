document.addEventListener('DOMContentLoaded', function() {
    const photoGallery = document.querySelector('.photo-gallery');
    const featuredPhoto = document.getElementById('featured-photo');
    const contentWrapper = document.querySelector('.content-wrapper');
    const textDisplay = document.getElementById('text-display');
    const pageContainer = document.querySelector('.page-container');
    let isFeaturePhotoShown = false;
    let lastMouseX = 0;
    let isScrolling = false;

    // 图片点击和悬停功能
    photoGallery.addEventListener('click', function(e) {
        const clickedPhoto = e.target.closest('.photo');
        if (clickedPhoto) {
            const imgSrc = clickedPhoto.querySelector('img').src;
            const imgAlt = clickedPhoto.querySelector('img').alt;
            const text = clickedPhoto.getAttribute('data-text');

            featuredPhoto.innerHTML = `<img src="${imgSrc}" alt="${imgAlt}">`;
            textDisplay.textContent = text;

            contentWrapper.classList.add('show-featured');
            featuredPhoto.classList.add('show');
            isFeaturePhotoShown = true;
            
            lastMouseX = e.clientX;
        }
    });

    // 鼠标移动关闭大图功能
    document.addEventListener('mousemove', function(e) {
        if (isFeaturePhotoShown) {
            const deltaX = e.clientX - lastMouseX;
            
            if (deltaX > 100) {
                contentWrapper.classList.remove('show-featured');
                featuredPhoto.classList.remove('show');
                isFeaturePhotoShown = false;
            }
        }
    });

    // 图片悬停文字显示
    photoGallery.addEventListener('mouseover', function(e) {
        const hoveredPhoto = e.target.closest('.photo');
        if (hoveredPhoto) {
            const text = hoveredPhoto.getAttribute('data-text');
            textDisplay.textContent = text;
        }
    });

    // 鼠标离开图片时清空文字
    photoGallery.addEventListener('mouseout', function(e) {
        if (!e.target.closest('.photo')) {
            textDisplay.textContent = '';
        }
    });

    // 滚动行为
    window.addEventListener('wheel', function(e) {
        if (!isScrolling) {
            isScrolling = true;
            if (e.deltaY > 0) {
                // 向下滚动
                pageContainer.scrollBy({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            } else {
                // 向上滚动
                pageContainer.scrollBy({
                    top: -window.innerHeight,
                    behavior: 'smooth'
                });
            }
            setTimeout(() => { isScrolling = false; }, 1000);
        }
    });
});