export default function Post({ title, body }) {
  return (
    <article className="post">
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  );
}

