/* ============================================
   TheTastyFood — Menu Page Scripts
   ============================================ */

(function () {
  'use strict';

  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const foodCards = document.querySelectorAll('.food-card');

  // ── Show cards with staggered animation ──
  function showCards(cards) {
    cards.forEach(function (card, index) {
      card.style.display = '';
      setTimeout(function () {
        card.classList.add('visible');
      }, 100 + index * 30);
    });
  }

  // ── Hide all cards ──
  function hideAllCards() {
    foodCards.forEach(function (card) {
      card.classList.remove('visible');
    });
  }

  // ── Filter by category ──
  function filterCards(category) {
    hideAllCards();

    setTimeout(function () {
      var matchingCards = [];

      foodCards.forEach(function (card) {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          matchingCards.push(card);
        } else {
          card.style.display = 'none';
        }
      });

      setTimeout(function () {
        showCards(matchingCards);
      }, 50);
    }, 50);
  }

  // ── Button click handler ──
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active state
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Apply filter
      var category = btn.getAttribute('data-category');
      filterCards(category);
    });
  });

  // ── Initial load: show all cards with stagger ──
  var allCards = Array.prototype.slice.call(foodCards);
  showCards(allCards);

})();
