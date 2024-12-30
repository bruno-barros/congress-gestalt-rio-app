import Link from "next/link";
import Container from "react-bootstrap/cjs/Container";

export default function ExamplesPage() {
  return <Container>
    <h1>Examples Page</h1>
    <p>This page is for examples of different components and hooks</p>
    <p>
        <Link href="/examples/recharts/bar">Form Example</Link>
    </p>
  </Container>;
}
