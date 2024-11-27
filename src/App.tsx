import { Body, Heading, P, Text } from "vienna-ui";
import styles from "./App.module.css";
import { UserTable } from "./components";

function App() {
  return (
    <Body className={styles.App}>
      <header className={`${styles.header} ${styles.page__section}`}>
        <Heading>Front-end trainee test task</Heading>
        <P className="" size={"xl"}>
          Никита Жуйков
        </P>
      </header>

      <main className={styles.main}>
        <section className={styles.page__section}>
          <UserTable />
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.page__section}>
          <Text align={"center"}>2024</Text>
        </div>
      </footer>
    </Body>
  );
}

export default App;
