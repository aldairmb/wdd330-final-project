const apiKey = 'b9b25782075944c282a534210d4027eb';

// Disable one filter when the other is selected
document.getElementById('category').addEventListener('change', function() {
  const keywordInput = document.getElementById('keyword-filter');
  if (this.value) {
    document.getElementById('source').disabled = true;
    keywordInput.disabled = true;  // Disable keyword input
    document.getElementById('source').value = '';  // Reset the source dropdown
  } else {
    document.getElementById('source').disabled = false;
    keywordInput.disabled = false;  // Re-enable keyword input if category is cleared
  }
});

document.getElementById('source').addEventListener('change', function() {
  const keywordInput = document.getElementById('keyword-filter');
  if (this.value) {
    document.getElementById('category').disabled = true;
    keywordInput.disabled = true;  // Disable keyword input
    document.getElementById('category').value = '';  // Reset the category dropdown
  } else {
    document.getElementById('category').disabled = false;
    keywordInput.disabled = false;  // Re-enable keyword input if source is cleared
  }
});

// Disable filters if another one is entered
document.getElementById('keyword-filter').addEventListener('input', function () {
    const keywordValue = this.value.trim();
    const categorySelect = document.getElementById('category');
    const sourceSelect = document.getElementById('source');

    if (keywordValue) {
        // Disable other filters if a keyword is entered
        categorySelect.disabled = true;
        sourceSelect.disabled = true;
        categorySelect.value = ''; // Reset category dropdown
        sourceSelect.value = ''; // Reset source dropdown
    } else {
        // Re-enable filters if keyword is cleared
        categorySelect.disabled = false;
        sourceSelect.disabled = false;
    }
});

// Handle form submission
document.getElementById('news-filters').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Collect the selected filter values
  const category = document.getElementById('category').value;
  const source = document.getElementById('source').value;
  const keyword = document.getElementById('keyword-filter').value.trim();

  // Initialize the API URL
  let url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}`;

  // Apply filters to URL
  if (category && !keyword) {
    url += `&category=${category}`;
  } else if (source && !keyword) {
    url += `&sources=${source}`;
  }

  if (keyword) {
    url += `&q=${encodeURIComponent(keyword)}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    const articlesList = document.getElementById('articles-list');
    articlesList.innerHTML = ''; // Clear previous results

    if (data.status === 'ok' && data.articles.length > 0) {
      data.articles.slice(0, 10).forEach(article => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <strong>Title:</strong> ${article.title} <br>
          <strong>Author:</strong> ${article.author || 'Unknown'} <br>
          <strong>Description:</strong> ${article.description || 'No description available.'} <br>
          <strong>Source:</strong> ${article.source.name} <br>
          <strong>URL:</strong> <a href="${article.url}" target="_blank">Read more</a><br>
          <img src="${article.urlToImage}" alt="Image" style="width:100px;">
          <hr>
        `;
        articlesList.appendChild(listItem);
      });
    } else {
      articlesList.innerHTML = '<li>No articles found for the selected filters.</li>';
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
});