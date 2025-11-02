const form = document.getElementById('form');
const reviewList = document.getElementById('review-list');
const reviewCount = document.getElementById('count');
const categorySelect = document.getElementById('filter-category');

// Star rating system
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating');

stars.forEach(star => {
  star.addEventListener('click', () => {
    const value = star.getAttribute('data-value');
    ratingInput.value = value;
    stars.forEach(s => {
      s.classList.toggle('active', s.getAttribute('data-value') <= value);
    });
  });
});

// Fetch and display existing reviews
const loadReviews = async (filter = 'All') => {
  const res = await fetch('/api/reviews');
  const reviews = await res.json();
  const filteredReviews = filter === 'All' ? reviews : reviews.filter(r => r.category === filter);

  reviewCount.textContent = filteredReviews.length;
  reviewList.innerHTML = filteredReviews
    .map(r => `
    <li class="review-item">
      <span class="category-tag category-${r.category}">${r.category}</span>
      <strong>${r.name}</strong> <span style="color: #ffce00;">${'★'.repeat(r.rating)}</span><br>
      <p>${r.text}</p>
      <small>${new Date(r.timestamp).toLocaleString()}</small>
    </li>`
    )
    .join('');
};

// Category filter change listener
categorySelect.addEventListener('change', (e) => {
  loadReviews(e.target.value);
});

// Submit new review
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const rating = ratingInput.value;
  const text = document.getElementById('text').value;

  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, rating, text }),
  });

  if (res.ok) {
    form.reset();
    stars.forEach(s => s.classList.remove('active'));
    ratingInput.value = '';
    loadReviews();
  }
});

loadReviews();
