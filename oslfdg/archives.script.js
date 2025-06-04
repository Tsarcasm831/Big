document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('archives-book-list');
  container.innerHTML = '';

  try {
    const resp = await fetch('./archives.json');
    const data = await resp.json();
    const book = data.lexica_chaotica;
    const version = book.version;

    // Book wrapper
    const bookWrapper = document.createElement('article');
    bookWrapper.className = 'archive-book';
    bookWrapper.id = 'lexica-chaotica';

    // Book header with icon and title
    const header = document.createElement('div');
    header.className = 'archive-book-header';
    header.innerHTML = `
      <div class="archive-book-icon" role="img" aria-label="Book Icon">
        <svg class="page-tree-icon" aria-hidden="true"><use href="#book-icon"/></svg>
      </div>
      <h2 class="archive-book-title">Lexica Chaotica <small>v${version}</small></h2>
    `;
    bookWrapper.append(header);

    // Entries container
    const entriesContainer = document.createElement('div');
    entriesContainer.className = 'archive-book-entries';

    book.entries.forEach(entry => {
      const section = document.createElement('section');
      section.className = 'archive-entry';
      section.id = `entry-${entry.id}`;

      const entryTitle = document.createElement('h3');
      entryTitle.className = 'entry-title';
      entryTitle.textContent = `${entry.id}. ${entry.title}`;
      section.append(entryTitle);

      const entrySummary = document.createElement('p');
      entrySummary.className = 'entry-summary';
      entrySummary.textContent = entry.summary;
      section.append(entrySummary);

      const entryBody = document.createElement('div');
      entryBody.className = 'entry-body';
      entryBody.textContent = entry.body;
      section.append(entryBody);

      const kwList = document.createElement('ul');
      kwList.className = 'entry-keywords';
      entry.keywords.forEach(kw => {
        const li = document.createElement('li');
        li.textContent = kw;
        kwList.append(li);
      });
      section.append(kwList);

      entriesContainer.append(section);
    });

    bookWrapper.append(entriesContainer);
    container.append(bookWrapper);

    // Toggle expansion on book header click
    bookWrapper.addEventListener('click', () => bookWrapper.classList.toggle('expanded'));

    // Toggle expansion on entry click
    entriesContainer.querySelectorAll('.archive-entry').forEach(section => {
      section.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent toggling book
        section.classList.toggle('expanded');
      });
    });

  } catch (e) {
    container.textContent = 'Failed to load archives.';
    console.error(e);
  }
});
