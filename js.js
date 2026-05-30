document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  let lastClickTime = 0;

  cards.forEach(card => {
    const header = card.querySelector('.card-header');

    if (header) {
      // Click handler only - no touch behavior
      header.addEventListener('click', function(e) {
        e.preventDefault();
        lastClickTime = Date.now();
        toggleCard(card);
      });
    }
  });

  function toggleCard(card) {
    cards.forEach(c => {
      if (c !== card) {
        c.classList.remove('open');
      }
    });
    card.classList.toggle('open');
  }

  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    document.addEventListener('click', function(event) {
      if (!mobileMenu.contains(event.target) && !burger.contains(event.target) && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) {
        return;
      }
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  });

  const carouselTracks = document.querySelectorAll('.carousel-track');
  const throttle = (func, delay) => {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  };

  carouselTracks.forEach(track => {
    const items = Array.from(track.querySelectorAll('.carousel-item'));
    const dotsContainer = track.parentElement ? track.parentElement.querySelector('.carousel-dots') : null;
    if (!items.length || !dotsContainer) {
      return;
    }

    dotsContainer.innerHTML = '';
    items.forEach((item, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Photo ' + (index + 1));
      if (index === 0) {
        dot.classList.add('active');
      }
      dot.addEventListener('click', () => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);
    const updateActiveDot = () => {
      const activeIndex = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
    };

    track.addEventListener('scroll', throttle(updateActiveDot, 100));
    updateActiveDot();
  });

  // Video Carousel
  const videoDots = document.querySelectorAll('.video-dot');
  const videoItems = document.querySelectorAll('.video-item');
  let currentVideoIndex = 0;
  let autoPlayTimer = null;

  function switchToVideo(index) {
    if (index < 0 || index >= videoItems.length) return;

    // Stop all videos
    videoItems.forEach(video => {
      video.pause();
      video.classList.remove('active');
    });

    // Stop all dots
    videoDots.forEach(dot => {
      dot.classList.remove('active');
    });

    // Play new video
    currentVideoIndex = index;
    videoItems[currentVideoIndex].classList.add('active');
    videoDots[currentVideoIndex].classList.add('active');
    const video = videoItems[currentVideoIndex];
    video.currentTime = 0;
    video.play().catch(err => console.log('Video autoplay blocked:', err));

    // Clear and reset auto-play timer
    clearTimeout(autoPlayTimer);
    autoPlayTimer = setTimeout(() => {
      switchToVideo((currentVideoIndex + 1) % videoItems.length);
    }, video.duration * 1000 + 500); // Wait for video to finish + 500ms
  }

  // Handle video end event (in case autoplay timer fails)
  videoItems.forEach((video, index) => {
    video.addEventListener('ended', () => {
      if (currentVideoIndex === index) {
        switchToVideo((index + 1) % videoItems.length);
      }
    });
  });

  // Dot click handlers
  videoDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearTimeout(autoPlayTimer);
      switchToVideo(index);
      // Resume auto-play
      autoPlayTimer = setTimeout(() => {
        switchToVideo((index + 1) % videoItems.length);
      }, videoItems[index].duration * 1000 + 500);
    });
  });

  // Start with first video
  if (videoItems.length > 0) {
    switchToVideo(0);
  }
});
