(() => {
  const pages = ['home', 'articles', 'tags', 'search', 'about'];
  const names = { articles: '文章', tags: '标签', search: '搜索', about: '关于' };
  let articles = [];
  let category = '';
  const showPage = () => {
    const hash = location.hash.slice(1);
    const page = pages.includes(hash) ? hash : 'home';
    pages.forEach(id => { document.getElementById(id).hidden = id !== page; });
    document.querySelectorAll('nav a[data-page]').forEach(a => {
      if (a.dataset.page === page) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    document.title = page === 'home' ? "ZZZs26's Blog" : `${names[page]} | ZZZs26's Blog`;
    window.scrollTo(0, 0);
  };
  const list = (target, items, message) => {
    target.replaceChildren();
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'empty'; empty.textContent = message; target.append(empty); return;
    }
    const ul = document.createElement('ul'); ul.className = 'article-list';
    items.forEach(item => {
      const li = document.createElement('li');
      const time = document.createElement('time'); time.dateTime = item.date; time.textContent = item.date;
      const link = document.createElement('a'); link.href = item.url; link.textContent = item.title;
      const type = document.createElement('span'); type.className = 'article-category'; type.textContent = item.category;
      li.append(time, link, type); ul.append(li);
    });
    target.append(ul);
  };
  const render = () => {
    list(document.getElementById('recent-list'), articles.slice(0, 5), '这里还没有文章，敬请期待。');
    list(document.getElementById('all-list'), articles, '这里还没有文章，敬请期待。');
    list(document.getElementById('category-list'), category ? articles.filter(a => a.category === category) : [], category ? `「${category}」还没有文章。` : '选择分类，查看相关文章。');
    const query = document.getElementById('query').value.trim().toLocaleLowerCase();
    const matches = query ? articles.filter(a => [a.title, a.category, a.venue, (a.authors || []).join(' '), (a.tags || []).join(' '), a.content].join(' ').toLocaleLowerCase().includes(query)) : [];
    list(document.getElementById('search-list'), matches, query ? '没有找到相关文章。' : '输入关键词，搜索文章。');
  };
  document.querySelectorAll('.tag').forEach(button => button.addEventListener('click', () => {
    category = button.textContent;
    document.querySelectorAll('.tag').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    render();
  }));
  document.getElementById('query').addEventListener('input', render);
  window.addEventListener('hashchange', showPage); showPage();
  fetch('search-index.json').then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }).then(data => {
    articles = data.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
    render();
  }).catch(() => {
    ['recent-list', 'all-list', 'category-list', 'search-list'].forEach(id => list(document.getElementById(id), [], '文章加载失败。请通过网站或本地服务器访问，并检查构建是否成功。'));
  });
})();
