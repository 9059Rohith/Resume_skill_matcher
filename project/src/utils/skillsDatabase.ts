export const skillsDatabase = {
  'Programming Languages': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'Swift', 'Kotlin', 'PHP', 'Ruby', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML',
    'CSS', 'Sass', 'Less', 'C', 'Objective-C', 'Dart', 'Perl', 'Shell Scripting',
    'PowerShell', 'VBA', 'Assembly', 'COBOL', 'Fortran', 'Haskell', 'Erlang',
    'Clojure', 'F#', 'Julia', 'Lua', 'Groovy', 'CoffeeScript', 'Elm'
  ],
  
  'Frameworks & Libraries': [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask',
    'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'FastAPI', 'Svelte',
    'Next.js', 'Nuxt.js', 'Gatsby', 'Ember.js', 'Backbone.js', 'jQuery',
    'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Ant Design', 'Chakra UI',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib',
    'Seaborn', 'OpenCV', 'Keras', 'Apache Spark', 'Hadoop', 'Storm'
  ],

  'Databases': [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    'Cassandra', 'DynamoDB', 'Neo4j', 'InfluxDB', 'CouchDB', 'MariaDB',
    'Amazon RDS', 'Google Cloud SQL', 'Firebase', 'Supabase', 'PlanetScale',
    'Snowflake', 'BigQuery', 'Redshift', 'Elasticsearch', 'Apache Solr'
  ],

  'Cloud Platforms': [
    'AWS', 'Microsoft Azure', 'Google Cloud Platform', 'Heroku', 'Vercel',
    'Netlify', 'DigitalOcean', 'Linode', 'IBM Cloud', 'Oracle Cloud',
    'Alibaba Cloud', 'Cloudflare', 'Firebase', 'Supabase', 'Railway',
    'PlanetScale', 'Fly.io', 'Render', 'AWS Lambda', 'Azure Functions',
    'Google Cloud Functions', 'CloudFormation', 'Terraform', 'Pulumi'
  ],

  'DevOps & Tools': [
    'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
    'Circle CI', 'Travis CI', 'Terraform', 'Ansible', 'Chef', 'Puppet',
    'Vagrant', 'Git', 'SVN', 'Mercurial', 'Jira', 'Confluence', 'Slack',
    'Teams', 'Zoom', 'Linux', 'Ubuntu', 'CentOS', 'macOS', 'Windows',
    'Bash', 'Zsh', 'Fish', 'Vim', 'Emacs', 'VS Code', 'IntelliJ IDEA',
    'Eclipse', 'Xcode', 'Android Studio', 'Postman', 'Insomnia', 'Swagger'
  ],

  'Soft Skills': [
    'Leadership', 'Communication', 'Problem Solving', 'Team Management',
    'Project Management', 'Strategic Planning', 'Analytical Thinking',
    'Creative Problem Solving', 'Adaptability', 'Time Management',
    'Critical Thinking', 'Decision Making', 'Conflict Resolution',
    'Negotiation', 'Public Speaking', 'Presentation Skills', 'Mentoring',
    'Coaching', 'Emotional Intelligence', 'Cultural Awareness',
    'Change Management', 'Risk Management', 'Innovation', 'Creativity'
  ],

  'Industry Specific': [
    // Finance
    'Financial Modeling', 'Risk Management', 'Bloomberg Terminal', 'Excel VBA',
    'MATLAB', 'R', 'Quantitative Analysis', 'Portfolio Management',
    'Derivatives Trading', 'Fixed Income', 'Equity Research', 'Credit Analysis',
    
    // Marketing
    'SEO', 'SEM', 'Google Analytics', 'Google Ads', 'Facebook Ads',
    'Content Strategy', 'Social Media Marketing', 'Email Marketing',
    'Marketing Automation', 'HubSpot', 'Salesforce', 'Marketo',
    
    // Healthcare
    'HIPAA Compliance', 'Electronic Health Records', 'Medical Coding',
    'Clinical Research', 'FDA Regulations', 'Medical Device Development',
    
    // Data Science
    'Machine Learning', 'Deep Learning', 'Natural Language Processing',
    'Computer Vision', 'Statistical Analysis', 'Data Visualization',
    'A/B Testing', 'Predictive Modeling', 'Feature Engineering',
    
    // Cybersecurity
    'Penetration Testing', 'Vulnerability Assessment', 'CISSP', 'CISM',
    'Ethical Hacking', 'Network Security', 'Incident Response', 'SIEM'
  ],

  'Certifications': [
    'AWS Certified Solutions Architect', 'Azure Fundamentals', 'Google Cloud Professional',
    'Certified Kubernetes Administrator', 'Docker Certified Associate',
    'PMP', 'Scrum Master', 'Product Owner', 'CISSP', 'CISM', 'CEH',
    'CompTIA Security+', 'CompTIA Network+', 'CCNA', 'CCNP', 'CCIE',
    'Microsoft Certified', 'Oracle Certified', 'Salesforce Certified',
    'HubSpot Certified', 'Google Analytics Certified', 'Facebook Blueprint'
  ]
};

export const getAllSkills = (): string[] => {
  return Object.values(skillsDatabase).flat();
};

export const getSkillCategory = (skill: string): string => {
  for (const [category, skills] of Object.entries(skillsDatabase)) {
    if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      return category;
    }
  }
  return 'Other';
};

export const getRelatedSkills = (skill: string): string[] => {
  const category = getSkillCategory(skill);
  if (category === 'Other') return [];
  
  return skillsDatabase[category as keyof typeof skillsDatabase]
    .filter(s => s.toLowerCase() !== skill.toLowerCase())
    .slice(0, 5);
};