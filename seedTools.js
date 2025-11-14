import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tool from './models/Tool.js';

dotenv.config();

const tools = [
  // Code Editors & IDEs (1-20)
  { name: 'Visual Studio Code', description: 'Free, open-source code editor with extensive extensions', url: 'https://code.visualstudio.com', category: 'editor', free: true, rating: 5, popular: true },
  { name: 'Sublime Text', description: 'Sophisticated text editor for code, markup, and prose', url: 'https://www.sublimetext.com', category: 'editor', free: false, rating: 5, popular: true },
  { name: 'Atom', description: 'Hackable text editor built with web technologies', url: 'https://atom.io', category: 'editor', free: true, rating: 4 },
  { name: 'WebStorm', description: 'Powerful IDE for JavaScript and TypeScript development', url: 'https://www.jetbrains.com/webstorm', category: 'editor', free: false, rating: 5 },
  { name: 'IntelliJ IDEA', description: 'Java IDE with advanced coding assistance', url: 'https://www.jetbrains.com/idea', category: 'editor', free: false, rating: 5 },
  { name: 'PyCharm', description: 'Python IDE for professional developers', url: 'https://www.jetbrains.com/pycharm', category: 'editor', free: true, rating: 5 },
  { name: 'Vim', description: 'Highly configurable text editor built for efficient text editing', url: 'https://www.vim.org', category: 'editor', free: true, rating: 5 },
  { name: 'Emacs', description: 'Extensible, customizable text editor', url: 'https://www.gnu.org/software/emacs', category: 'editor', free: true, rating: 4 },
  { name: 'Brackets', description: 'Modern text editor for web design', url: 'https://brackets.io', category: 'editor', free: true, rating: 4 },
  { name: 'Code::Blocks', description: 'Free C/C++ IDE', url: 'https://www.codeblocks.org', category: 'editor', free: true, rating: 4 },
  { name: 'Eclipse', description: 'Open-source IDE platform', url: 'https://www.eclipse.org', category: 'editor', free: true, rating: 4 },
  { name: 'NetBeans', description: 'Java IDE and development platform', url: 'https://netbeans.apache.org', category: 'editor', free: true, rating: 4 },
  { name: 'Xcode', description: 'IDE for macOS and iOS development', url: 'https://developer.apple.com/xcode', category: 'editor', free: true, rating: 5 },
  { name: 'Android Studio', description: 'Official IDE for Android development', url: 'https://developer.android.com/studio', category: 'editor', free: true, rating: 5 },
  { name: 'Rider', description: 'Cross-platform .NET IDE', url: 'https://www.jetbrains.com/rider', category: 'editor', free: false, rating: 5 },
  { name: 'PhpStorm', description: 'PHP IDE for professional developers', url: 'https://www.jetbrains.com/phpstorm', category: 'editor', free: false, rating: 5 },
  { name: 'RubyMine', description: 'Ruby and Rails IDE', url: 'https://www.jetbrains.com/ruby', category: 'editor', free: false, rating: 5 },
  { name: 'CLion', description: 'C/C++ IDE by JetBrains', url: 'https://www.jetbrains.com/clion', category: 'editor', free: false, rating: 5 },
  { name: 'GoLand', description: 'Go IDE by JetBrains', url: 'https://www.jetbrains.com/go', category: 'editor', free: false, rating: 5 },
  { name: 'ReSharper', description: 'Visual Studio extension for .NET', url: 'https://www.jetbrains.com/resharper', category: 'editor', free: false, rating: 5 },

  // Version Control (21-30)
  { name: 'GitHub', description: 'Code hosting platform for version control and collaboration', url: 'https://github.com', category: 'version-control', free: true, rating: 5, popular: true },
  { name: 'GitLab', description: 'Complete DevOps platform with Git repository management', url: 'https://gitlab.com', category: 'version-control', free: true, rating: 5, popular: true },
  { name: 'Bitbucket', description: 'Git code management for teams', url: 'https://bitbucket.org', category: 'version-control', free: true, rating: 4 },
  { name: 'SourceTree', description: 'Free Git GUI client for Windows and Mac', url: 'https://www.sourcetreeapp.com', category: 'version-control', free: true, rating: 4 },
  { name: 'GitKraken', description: 'Intuitive Git GUI and Git client', url: 'https://www.gitkraken.com', category: 'version-control', free: true, rating: 4 },
  { name: 'TortoiseGit', description: 'Windows Shell Interface to Git', url: 'https://tortoisegit.org', category: 'version-control', free: true, rating: 4 },
  { name: 'GitHub Desktop', description: 'Simple Git client for GitHub', url: 'https://desktop.github.com', category: 'version-control', free: true, rating: 4 },
  { name: 'SmartGit', description: 'Git client with advanced features', url: 'https://www.syntevo.com/smartgit', category: 'version-control', free: false, rating: 4 },
  { name: 'Fork', description: 'Fast and friendly Git client for Mac and Windows', url: 'https://git-fork.com', category: 'version-control', free: false, rating: 4 },
  { name: 'Tower', description: 'Powerful Git client for Mac and Windows', url: 'https://www.git-tower.com', category: 'version-control', free: false, rating: 4 },

  // API Development (31-40)
  { name: 'Postman', description: 'API platform for building and using APIs', url: 'https://www.postman.com', category: 'api', free: true, rating: 5, popular: true },
  { name: 'Insomnia', description: 'REST client with GraphQL support', url: 'https://insomnia.rest', category: 'api', free: true, rating: 5 },
  { name: 'Thunder Client', description: 'Lightweight REST API client for VS Code', url: 'https://www.thunderclient.com', category: 'api', free: true, rating: 4 },
  { name: 'HTTPie', description: 'Command-line HTTP client with intuitive UI', url: 'https://httpie.io', category: 'api', free: true, rating: 4 },
  { name: 'Swagger', description: 'API documentation and design platform', url: 'https://swagger.io', category: 'api', free: true, rating: 5 },
  { name: 'REST Client', description: 'VS Code extension for REST API testing', url: 'https://marketplace.visualstudio.com/items?itemName=humao.rest-client', category: 'api', free: true, rating: 4 },
  { name: 'Bruno', description: 'Open-source API client', url: 'https://www.usebruno.com', category: 'api', free: true, rating: 4 },
  { name: 'Paw', description: 'Mac HTTP client for testing APIs', url: 'https://paw.cloud', category: 'api', free: false, rating: 4 },
  { name: 'Apiary', description: 'API design and documentation platform', url: 'https://apiary.io', category: 'api', free: true, rating: 4 },
  { name: 'Stoplight', description: 'API design and documentation tool', url: 'https://stoplight.io', category: 'api', free: true, rating: 4 },

  // Databases (41-50)
  { name: 'MySQL Workbench', description: 'Visual database design and administration tool', url: 'https://www.mysql.com/products/workbench', category: 'database', free: true, rating: 5 },
  { name: 'MongoDB Compass', description: 'GUI for MongoDB database management', url: 'https://www.mongodb.com/products/compass', category: 'database', free: true, rating: 5 },
  { name: 'pgAdmin', description: 'PostgreSQL administration and development platform', url: 'https://www.pgadmin.org', category: 'database', free: true, rating: 5 },
  { name: 'DBeaver', description: 'Universal database tool for developers', url: 'https://dbeaver.io', category: 'database', free: true, rating: 5 },
  { name: 'TablePlus', description: 'Modern database management tool', url: 'https://tableplus.com', category: 'database', free: false, rating: 5 },
  { name: 'Redis Desktop Manager', description: 'GUI for Redis database management', url: 'https://resp.app', category: 'database', free: false, rating: 4 },
  { name: 'DataGrip', description: 'Database IDE by JetBrains', url: 'https://www.jetbrains.com/datagrip', category: 'database', free: false, rating: 5 },
  { name: 'Navicat', description: 'Database administration and development tool', url: 'https://www.navicat.com', category: 'database', free: false, rating: 4 },
  { name: 'Sequel Pro', description: 'MySQL database management for macOS', url: 'https://www.sequelpro.com', category: 'database', free: true, rating: 4 },
  { name: 'HeidiSQL', description: 'Lightweight database management tool', url: 'https://www.heidisql.com', category: 'database', free: true, rating: 4 },

  // Design Tools (51-60)
  { name: 'Figma', description: 'Collaborative interface design tool', url: 'https://www.figma.com', category: 'design', free: true, rating: 5, popular: true },
  { name: 'Adobe XD', description: 'UX/UI design and prototyping tool', url: 'https://www.adobe.com/products/xd.html', category: 'design', free: false, rating: 5 },
  { name: 'Sketch', description: 'Digital design toolkit for Mac', url: 'https://www.sketch.com', category: 'design', free: false, rating: 5 },
  { name: 'InVision', description: 'Digital product design platform', url: 'https://www.invisionapp.com', category: 'design', free: true, rating: 4 },
  { name: 'Canva', description: 'Graphic design platform for creating visuals', url: 'https://www.canva.com', category: 'design', free: true, rating: 4 },
  { name: 'Adobe Photoshop', description: 'Image editing and graphic design software', url: 'https://www.adobe.com/products/photoshop.html', category: 'design', free: false, rating: 5 },
  { name: 'Adobe Illustrator', description: 'Vector graphics and illustration software', url: 'https://www.adobe.com/products/illustrator.html', category: 'design', free: false, rating: 5 },
  { name: 'Framer', description: 'Interactive design and prototyping tool', url: 'https://www.framer.com', category: 'design', free: true, rating: 4 },
  { name: 'Principle', description: 'Animation and interaction design tool', url: 'https://principleformac.com', category: 'design', free: false, rating: 4 },
  { name: 'Zeplin', description: 'Design handoff and collaboration tool', url: 'https://zeplin.io', category: 'design', free: true, rating: 4 },

  // Testing (61-70)
  { name: 'Jest', description: 'JavaScript testing framework', url: 'https://jestjs.io', category: 'testing', free: true, rating: 5, popular: true },
  { name: 'Cypress', description: 'End-to-end testing framework', url: 'https://www.cypress.io', category: 'testing', free: true, rating: 5 },
  { name: 'Selenium', description: 'Browser automation framework', url: 'https://www.selenium.dev', category: 'testing', free: true, rating: 5 },
  { name: 'Playwright', description: 'End-to-end testing framework', url: 'https://playwright.dev', category: 'testing', free: true, rating: 5 },
  { name: 'K6', description: 'Modern load testing tool', url: 'https://k6.io', category: 'testing', free: true, rating: 4 },
  { name: 'Mocha', description: 'JavaScript test framework', url: 'https://mochajs.org', category: 'testing', free: true, rating: 5 },
  { name: 'Jasmine', description: 'Behavior-driven development framework', url: 'https://jasmine.github.io', category: 'testing', free: true, rating: 4 },
  { name: 'Puppeteer', description: 'Headless Chrome Node.js API', url: 'https://pptr.dev', category: 'testing', free: true, rating: 5 },
  { name: 'TestCafe', description: 'End-to-end web testing framework', url: 'https://testcafe.io', category: 'testing', free: true, rating: 4 },
  { name: 'Vitest', description: 'Fast unit test framework', url: 'https://vitest.dev', category: 'testing', free: true, rating: 5 },

  // Deployment & DevOps (71-85)
  { name: 'Docker', description: 'Containerization platform for applications', url: 'https://www.docker.com', category: 'deployment', free: true, rating: 5, popular: true },
  { name: 'Kubernetes', description: 'Container orchestration platform', url: 'https://kubernetes.io', category: 'deployment', free: true, rating: 5 },
  { name: 'Vercel', description: 'Platform for frontend deployment', url: 'https://vercel.com', category: 'deployment', free: true, rating: 5, popular: true },
  { name: 'Netlify', description: 'Web development platform', url: 'https://www.netlify.com', category: 'deployment', free: true, rating: 5, popular: true },
  { name: 'Heroku', description: 'Cloud platform for deploying apps', url: 'https://www.heroku.com', category: 'deployment', free: true, rating: 4 },
  { name: 'AWS', description: 'Amazon Web Services cloud platform', url: 'https://aws.amazon.com', category: 'deployment', free: false, rating: 5 },
  { name: 'DigitalOcean', description: 'Cloud infrastructure provider', url: 'https://www.digitalocean.com', category: 'deployment', free: false, rating: 4 },
  { name: 'Azure', description: 'Microsoft cloud computing platform', url: 'https://azure.microsoft.com', category: 'deployment', free: false, rating: 5 },
  { name: 'Google Cloud', description: 'Google cloud computing platform', url: 'https://cloud.google.com', category: 'deployment', free: false, rating: 5 },
  { name: 'Railway', description: 'Deploy apps with zero configuration', url: 'https://railway.app', category: 'deployment', free: true, rating: 4 },
  { name: 'Render', description: 'Cloud platform for hosting apps', url: 'https://render.com', category: 'deployment', free: true, rating: 4 },
  { name: 'Fly.io', description: 'Global application platform', url: 'https://fly.io', category: 'deployment', free: true, rating: 4 },
  { name: 'Cloudflare Pages', description: 'JAMstack platform for frontend developers', url: 'https://pages.cloudflare.com', category: 'deployment', free: true, rating: 4 },
  { name: 'GitHub Actions', description: 'CI/CD platform integrated with GitHub', url: 'https://github.com/features/actions', category: 'deployment', free: true, rating: 5 },
  { name: 'Jenkins', description: 'Open-source automation server', url: 'https://www.jenkins.io', category: 'deployment', free: true, rating: 5 },

  // Package Managers (86-95)
  { name: 'npm', description: 'Node.js package manager', url: 'https://www.npmjs.com', category: 'package-manager', free: true, rating: 5, popular: true },
  { name: 'Yarn', description: 'Fast, reliable package manager', url: 'https://yarnpkg.com', category: 'package-manager', free: true, rating: 5 },
  { name: 'pnpm', description: 'Fast, disk space efficient package manager', url: 'https://pnpm.io', category: 'package-manager', free: true, rating: 4 },
  { name: 'Composer', description: 'PHP dependency manager', url: 'https://getcomposer.org', category: 'package-manager', free: true, rating: 5 },
  { name: 'pip', description: 'Python package installer', url: 'https://pip.pypa.io', category: 'package-manager', free: true, rating: 5 },
  { name: 'Conda', description: 'Package and environment manager', url: 'https://docs.conda.io', category: 'package-manager', free: true, rating: 4 },
  { name: 'NuGet', description: 'Package manager for .NET', url: 'https://www.nuget.org', category: 'package-manager', free: true, rating: 4 },
  { name: 'Maven', description: 'Java project management tool', url: 'https://maven.apache.org', category: 'package-manager', free: true, rating: 5 },
  { name: 'Gradle', description: 'Build automation tool', url: 'https://gradle.org', category: 'package-manager', free: true, rating: 5 },
  { name: 'Cargo', description: 'Rust package manager', url: 'https://doc.rust-lang.org/cargo', category: 'package-manager', free: true, rating: 5 },

  // Documentation (96-105)
  { name: 'Notion', description: 'All-in-one workspace for notes and docs', url: 'https://www.notion.so', category: 'documentation', free: true, rating: 5 },
  { name: 'Confluence', description: 'Team collaboration and documentation', url: 'https://www.atlassian.com/software/confluence', category: 'documentation', free: false, rating: 4 },
  { name: 'GitBook', description: 'Modern documentation platform', url: 'https://www.gitbook.com', category: 'documentation', free: true, rating: 4 },
  { name: 'Read the Docs', description: 'Documentation hosting platform', url: 'https://readthedocs.org', category: 'documentation', free: true, rating: 4 },
  { name: 'Docusaurus', description: 'Static site generator for documentation', url: 'https://docusaurus.io', category: 'documentation', free: true, rating: 5 },
  { name: 'VitePress', description: 'Vite-powered static site generator', url: 'https://vitepress.dev', category: 'documentation', free: true, rating: 5 },
  { name: 'MkDocs', description: 'Static site generator for project documentation', url: 'https://www.mkdocs.org', category: 'documentation', free: true, rating: 4 },
  { name: 'Sphinx', description: 'Documentation generator for Python', url: 'https://www.sphinx-doc.org', category: 'documentation', free: true, rating: 4 },
  { name: 'JSDoc', description: 'API documentation generator for JavaScript', url: 'https://jsdoc.app', category: 'documentation', free: true, rating: 4 },
  { name: 'TypeDoc', description: 'Documentation generator for TypeScript', url: 'https://typedoc.org', category: 'documentation', free: true, rating: 4 },

  // Performance & Monitoring (106-120)
  { name: 'Lighthouse', description: 'Automated tool for improving web page quality', url: 'https://developers.google.com/web/tools/lighthouse', category: 'performance', free: true, rating: 5 },
  { name: 'Sentry', description: 'Error tracking and performance monitoring', url: 'https://sentry.io', category: 'performance', free: true, rating: 5 },
  { name: 'New Relic', description: 'Application performance monitoring', url: 'https://newrelic.com', category: 'performance', free: true, rating: 4 },
  { name: 'Datadog', description: 'Monitoring and analytics platform', url: 'https://www.datadoghq.com', category: 'performance', free: false, rating: 5 },
  { name: 'Grafana', description: 'Analytics and monitoring platform', url: 'https://grafana.com', category: 'performance', free: true, rating: 5 },
  { name: 'Prometheus', description: 'Monitoring and alerting toolkit', url: 'https://prometheus.io', category: 'performance', free: true, rating: 5 },
  { name: 'WebPageTest', description: 'Website performance testing tool', url: 'https://www.webpagetest.org', category: 'performance', free: true, rating: 4 },
  { name: 'GTmetrix', description: 'Website speed and performance testing', url: 'https://gtmetrix.com', category: 'performance', free: true, rating: 4 },
  { name: 'Pingdom', description: 'Website monitoring and uptime checking', url: 'https://www.pingdom.com', category: 'performance', free: false, rating: 4 },
  { name: 'LogRocket', description: 'Session replay and product analytics', url: 'https://logrocket.com', category: 'performance', free: true, rating: 4 },
  { name: 'Raygun', description: 'Error tracking and performance monitoring', url: 'https://raygun.com', category: 'performance', free: true, rating: 4 },
  { name: 'Rollbar', description: 'Error tracking and monitoring', url: 'https://rollbar.com', category: 'performance', free: true, rating: 4 },
  { name: 'Bugsnag', description: 'Error monitoring and stability management', url: 'https://www.bugsnag.com', category: 'performance', free: true, rating: 4 },
  { name: 'Honeybadger', description: 'Error tracking and uptime monitoring', url: 'https://www.honeybadger.io', category: 'performance', free: true, rating: 4 },
  { name: 'AppSignal', description: 'Application performance monitoring', url: 'https://www.appsignal.com', category: 'performance', free: true, rating: 4 },

  // Code Quality (121-135)
  { name: 'ESLint', description: 'JavaScript linter for code quality', url: 'https://eslint.org', category: 'code-quality', free: true, rating: 5, popular: true },
  { name: 'Prettier', description: 'Code formatter for consistent style', url: 'https://prettier.io', category: 'code-quality', free: true, rating: 5, popular: true },
  { name: 'SonarQube', description: 'Code quality and security analysis', url: 'https://www.sonarqube.org', category: 'code-quality', free: true, rating: 5 },
  { name: 'CodeClimate', description: 'Automated code review platform', url: 'https://codeclimate.com', category: 'code-quality', free: true, rating: 4 },
  { name: 'DeepSource', description: 'Automated code review and quality analysis', url: 'https://deepsource.io', category: 'code-quality', free: true, rating: 4 },
  { name: 'Codacy', description: 'Automated code quality platform', url: 'https://www.codacy.com', category: 'code-quality', free: true, rating: 4 },
  { name: 'Snyk', description: 'Security vulnerability scanning', url: 'https://snyk.io', category: 'code-quality', free: true, rating: 5 },
  { name: 'Dependabot', description: 'Automated dependency updates', url: 'https://dependabot.com', category: 'code-quality', free: true, rating: 5 },
  { name: 'Renovate', description: 'Automated dependency updates', url: 'https://www.mend.io/renovate', category: 'code-quality', free: true, rating: 4 },
  { name: 'Black', description: 'Python code formatter', url: 'https://black.readthedocs.io', category: 'code-quality', free: true, rating: 5 },
  { name: 'RuboCop', description: 'Ruby static code analyzer', url: 'https://rubocop.org', category: 'code-quality', free: true, rating: 4 },
  { name: 'Stylelint', description: 'CSS linter', url: 'https://stylelint.io', category: 'code-quality', free: true, rating: 4 },
  { name: 'TSLint', description: 'TypeScript linter', url: 'https://palantir.github.io/tslint', category: 'code-quality', free: true, rating: 4 },
  { name: 'JSHint', description: 'JavaScript code quality tool', url: 'https://jshint.com', category: 'code-quality', free: true, rating: 4 },
  { name: 'JSLint', description: 'JavaScript code quality tool', url: 'https://www.jslint.com', category: 'code-quality', free: true, rating: 3 },

  // Additional Tools (136-150)
  { name: 'Trello', description: 'Project management and collaboration tool', url: 'https://trello.com', category: 'documentation', free: true, rating: 4 },
  { name: 'Jira', description: 'Project management and issue tracking', url: 'https://www.atlassian.com/software/jira', category: 'documentation', free: false, rating: 5 },
  { name: 'Asana', description: 'Team collaboration and project management', url: 'https://asana.com', category: 'documentation', free: true, rating: 4 },
  { name: 'Slack', description: 'Team communication platform', url: 'https://slack.com', category: 'documentation', free: true, rating: 5 },
  { name: 'Discord', description: 'Voice and text chat for developers', url: 'https://discord.com', category: 'documentation', free: true, rating: 4 },
  { name: 'Zoom', description: 'Video conferencing and collaboration', url: 'https://zoom.us', category: 'documentation', free: true, rating: 4 },
  { name: 'Chrome DevTools', description: 'Built-in browser developer tools', url: 'https://developer.chrome.com/docs/devtools', category: 'code-quality', free: true, rating: 5 },
  { name: 'Firefox Developer Tools', description: 'Developer tools for Firefox', url: 'https://developer.mozilla.org/en-US/docs/Tools', category: 'code-quality', free: true, rating: 5 },
  { name: 'Wireshark', description: 'Network protocol analyzer', url: 'https://www.wireshark.org', category: 'api', free: true, rating: 5 },
  { name: 'Charles Proxy', description: 'HTTP proxy and monitoring tool', url: 'https://www.charlesproxy.com', category: 'api', free: false, rating: 4 },
  { name: 'Fiddler', description: 'Web debugging proxy tool', url: 'https://www.telerik.com/fiddler', category: 'api', free: true, rating: 4 },
  { name: 'ngrok', description: 'Secure tunnels to localhost', url: 'https://ngrok.com', category: 'api', free: true, rating: 4 },
  { name: 'LocalTunnel', description: 'Expose localhost to the internet', url: 'https://localtunnel.github.io/www', category: 'api', free: true, rating: 3 },
  { name: 'Cloudflare Tunnel', description: 'Secure connection to localhost', url: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-apps', category: 'api', free: true, rating: 4 },
  { name: 'Homebrew', description: 'Package manager for macOS', url: 'https://brew.sh', category: 'package-manager', free: true, rating: 5 },
];

async function seedTools() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing tools
    await Tool.deleteMany({});
    console.log('Cleared existing tools');

    // Insert tools
    const inserted = await Tool.insertMany(tools);
    console.log(`✅ Seeded ${inserted.length} tools successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding tools:', error);
    process.exit(1);
  }
}

seedTools();

