"use client";
import { CSSProperties, PropsWithChildren, useEffect } from "react";
import MainLayout from "../../components/layout";
import s from "./settings.module.scss";
import Nav from "react-bootstrap/Nav";
import { useRouter } from "next/router";
import Link from "next/link";
import { dump } from "../../src/helpers";
import useSettings from "../../components/hooks/useSettings";
import Form from "react-bootstrap/Form";
import useSettingsContext from "../../components/settings/settings-context";
import Loading from "../../components/ui/loading";
import LangSelector from "./lang-selector";

interface LayoutProps {}
export default function SettingsLayout(props: PropsWithChildren<LayoutProps>) {
  const { children } = props;
  const router = useRouter();
  const { currentEdition, setCurrentEdition } = useSettingsContext();
  const { data: evt, isLoading, isFetching } = useSettings(currentEdition);
  const linksStyle: CSSProperties = isLoading
    ? { opacity: ".4", pointerEvents: "none" }
    : {};

  useEffect(() => {
    const ed = router.query?.edition ? String(router.query?.edition) : null;
    if (ed) setCurrentEdition(ed);
  }, [router.query]);

  function str(s: string) {
    return s.replaceAll("_", " ");
  }

  function handleChangeEdition(e) {
    console.log(e.target.value);
    router.push(`${router.pathname}?edition=${e.target.value}`);
  }

  return (
    <MainLayout>
      {/* {dump({ currentEdition})} */}
      <div className={`row ${s.wrapper}`}>
        <div className={`col ${s.menucol}`}>
          <div className={s.inner_menu}>
            <div className={s.menucol__title}>Configurações</div>
            <div className="my-3">
              <LangSelector />
            </div>
            <Nav className="flex-column" variant="pills">
              <NavLink label="Geral" path="" />
              <Form className="mt-4">
                <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Edições</Form.Label>
                  {isLoading && <Loading size="sm" />}
                  {evt?.getEditionsKeys() && (
                    <Form.Control
                      as="select"
                      custom
                      onChange={handleChangeEdition}
                      value={currentEdition}
                    >
                      <option value="">Selecione</option>
                      {evt?.getEditionsKeys().map((e) => {
                        return (
                          <option key={e} value={e}>
                            {str(e)}
                          </option>
                        );
                      })}
                    </Form.Control>
                  )}
                </Form.Group>
              </Form>
              {currentEdition && (
                <div style={linksStyle}>
                  <NavLink label="Edição" path="/edition" />
                  <NavLink label="Inscrições" path="/subscriptions" />
                  <NavLink label="Trabalhos" path="/abstracts" />
                  <NavLink label="Revisão" path="/reviews" />
                  <NavLink label="Certificado" path="/certificates" />
                  <NavLink label="Atividades" path="/activities" />
                </div>
              )}
            </Nav>
          </div>
        </div>
        <div className={`col ${s.contentcol}`}>{children}</div>
      </div>
    </MainLayout>
  );
}

function NavLink({ label, path }: { label: string; path: string }) {
  const router = useRouter();
  const { currentEdition: ce } = useSettingsContext();
  const page = router?.route?.split("/").pop();
  const isActive =
    path.length === 0 ? page === "settings" : page === path.substring(1);
  return (
    <Link href={`/settings${path}?edition=${ce}`} passHref>
      <Nav.Link active={isActive}>{label}</Nav.Link>
    </Link>
  );
}
