type GithubRepository = {
  id: number;
  full_name: string;
  description: string;
  html_url: string;
};

type GithubResponse = {
  items: GithubRepository[];
};
