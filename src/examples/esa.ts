import { EsaClient } from "../clients/esa";

async function main() {
  // 環境変数から認証情報を取得
  const accessToken = process.env.ESA_ACCESS_TOKEN;
  const teamName = process.env.ESA_TEAM_NAME;

  if (!accessToken || !teamName) {
    throw new Error("ESA_ACCESS_TOKEN and ESA_TEAM_NAME must be set");
  }

  const client = new EsaClient(accessToken, teamName);

  try {
    // 記事の検索例
    const searchResult = await client.searchPosts({
      q: "タイトル",
      per_page: 10,
      sort: "updated",
      order: "desc",
    });
    console.log("検索結果:", searchResult);

    // 記事の取得例
    const post = await client.getPost(123);
    console.log("記事の詳細:", post);

    // 記事の作成例
    const newPost = await client.createPost({
      name: "新しい記事",
      body_md: "# 新しい記事\n\nこれは新しい記事です。",
      tags: ["タグ1", "タグ2"],
      category: "カテゴリ/サブカテゴリ",
      wip: false,
    });
    console.log("作成した記事:", newPost);
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

main();
