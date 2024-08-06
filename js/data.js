document.addEventListener('DOMContentLoaded', function() {
    const photoGallery = document.querySelector('.photo-gallery');
    const featuredPhoto = document.getElementById('featured-photo');
    const contentWrapper = document.querySelector('.content-wrapper');
    const textDisplay = document.getElementById('text-display');
    let isFeaturePhotoShown = false;
    let lastMouseX = 0;

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
            
            // 記錄點擊時的滑鼠 X 座標
            lastMouseX = e.clientX;
        }
    });

    // 監聽滑鼠移動事件
    document.addEventListener('mousemove', function(e) {
        if (isFeaturePhotoShown) {
            // 計算滑鼠移動距離
            const deltaX = e.clientX - lastMouseX;
            
            // 如果滑鼠向右移動超過一定距離（例如 100px），則關閉 featured photo
            if (deltaX > 100) {
                contentWrapper.classList.remove('show-featured');
                featuredPhoto.classList.remove('show');
                isFeaturePhotoShown = false;
            }
        }
    });
});