const apiKey = 'b9b25782075944c282a534210d4027eb'; // Replace with your News API key
const articlesContainer = document.getElementById('articles');

// Fetch articles
async function fetchArticles() {
  const today = new Date().toISOString().split('T')[0];
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=general&language=en&from=${today}&apiKey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'ok') {
      const articles = data.articles
        .filter(article => article.urlToImage) // Exclude articles without images
        .slice(0, 10); // Limit to 10 articles
      
      displayArticles(articles);
    } else {
      console.error('Error fetching articles:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Display articles
function displayArticles(articles) {
  articlesContainer.innerHTML = ''; // Clear any existing content

  articles.forEach(article => {
    const articleEl = document.createElement('div');
    articleEl.classList.add('article');
    articleEl.innerHTML = `
      <img src="${article.urlToImage}" alt="${article.title}">
      <h2>${article.title}</h2>
      <p><strong>Source:</strong> ${article.source.name}</p>
      <p><strong>Author:</strong> ${article.author || 'Unknown'}</p>
      <p><strong>Published Date:</strong> ${new Date(article.publishedAt).toLocaleDateString()}</p>
      <p>${article.description || 'No description available.'}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;
    articlesContainer.appendChild(articleEl);
  });
}

// Initialize
fetchArticles();
