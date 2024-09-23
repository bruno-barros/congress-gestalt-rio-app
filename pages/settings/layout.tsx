'use client';
import { PropsWithChildren, useEffect } from "react";
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

interface LayoutProps {}
export default function Layout(props: PropsWithChildren<LayoutProps>) {
  const { children } = props;
  const router = useRouter();
  const { data: evt, isLoading, isFetching } = useSettings();
  const ed = router.query?.edition || evt?.getEditionsKeys()[0];
  const { currentEdition, setCurrentEdition } = useSettingsContext()


  useEffect(()=>{
    const ed = String(router.query?.edition || evt?.getEditionsKeys()[0]);
    // console.log(ed)
    if(ed) setCurrentEdition(ed)
  }, [router.query, evt])

  function str(s: string){
    return s.replaceAll('_', ' ')
  }

  function handleChangeEdition(e){
    // console.log(router)
    router.push(`${router.pathname}?edition=${e.target.value}`)
  }

  return (
      <MainLayout>
        {/* {dump({ currentEdition})} */}
        <div className={`row ${s.wrapper}`}>
          <div className={`col ${s.menucol}`}>
            <div className={s.inner_menu}>
              <div className={s.menucol__title}>Configurações</div>
              <Nav className="flex-column" variant="pills">
                <NavLink label="Geral" path="" />
                <Form className="mt-4">
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Edição</Form.Label>
                    {isLoading && <Loading size="sm" />}
                    {evt?.getEditionsKeys() &&
                    <Form.Control as="select" custom onChange={handleChangeEdition}>
                      {evt?.getEditionsKeys().map((e) => {
                        return <option key={e} value={e} selected={e === currentEdition}>{str(e)}</option>;
                      })}
                    </Form.Control>}

                  </Form.Group>
                </Form>
                <NavLink label="Trabalhos" path="/abstracts" />
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
