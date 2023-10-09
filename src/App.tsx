import React from "react";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useIntersection } from "./libs/custom-hooks";

const fetcher = (url: string): Promise<GithubResponse> =>
  fetch(url).then((res) => res.json());

// コンポーネント内で定義するとレンダリングの度に新しいオブジェクトが生成されるので外に定義
// もしくはuseStateやuseRefの初期値として定義
const options = {
  rootMargin: "40px",
};

const App = () => {
  const [page, setPage] = useState(1);
  const [repos, setRepos] = useState<GithubRepository[]>([]);

  const [isIntersecting, ref] = useIntersection(options);
  useEffect(() => {
    if (isIntersecting) {
      setPage((p) => p + 1);
    }
  }, [isIntersecting]);

  useSWR(
    `https://api.github.com/search/repositories?q=language:js&per_page=10&page=${page}&sort=stars+updated`,
    fetcher,
    {
      onSuccess: (data) => {
        if (data && data.items.length > 0) {
          setRepos((r) => {
            const uniqueRepoIds = new Set(r.map((repo) => repo.id));
            const uniqueRepos = data.items.filter(
              (item) => !(item.id in uniqueRepoIds),
            );
            return [...r, ...uniqueRepos];
          });
        }
      },
      onError: (err) => {
        alert(`エラーが発生しました: ${err.message}`);
      },
    },
  );

  return (
    <ul style={{ paddingLeft: 0, margin: "1rem" }}>
      {repos.map((repo, index) => (
        <li
          ref={index === repos.length - 1 ? ref : null}
          key={repo.id + index} // GitHubのページネーションの仕様上、idが重複することがあるのでindexも含める
          style={{
            padding: "1rem",
            border: "1rem solid",
            boxSizing: "border-box",
            listStyle: "none",
          }}
        >
          <p>{repo.full_name}</p>
          <span>{repo.description}</span>
          <a href={repo.html_url}>{repo.html_url}</a>
        </li>
      ))}
    </ul>
  );
};

export default App;
