import Card from "react-bootstrap/Card";
import Edition from "../../src/resources/edition";
import { OrderCollection } from "../../src/resources/order";
import BadgeSubscribed from "../ui/badge-subscribed";
import Link from "next/link";
import { t } from "i18next";
import useCurrentUser from "../hooks/useCurrentUser";
import { dump } from "../../src/helpers";
import Ac, { ac } from "../access-control";
import { REQUIREMENTS } from "../access-control/requirements";
import useSettings from "../hooks/useSettings";
import useUserCertificates from "../hooks/useUserCertificates";

interface EditionCardProps {
  edition: Edition;
  orders: OrderCollection | null;
}
export default function EditionCard(props: EditionCardProps) {
  const { edition, orders } = props;
  const { user } = useCurrentUser();

  const { data: certs } = useUserCertificates(user?.getId(), edition?.getId());

//   const isSubscribed = false
  const certCnf = edition?.Certificate()
  const AbstractCnf = edition?.Abstract()
  const isCurrent = false
  const isUserAllowedToAbstracts = ac(user, [REQUIREMENTS.abstract.read], { edition })
  const isSubscribed = orders?.hasValidSubscription(edition)
  const isOpenSubscribe = edition.isOpenToSubscribe()
  const isOpenAbstract = edition.isOpenToAbstracts() && isUserAllowedToAbstracts
  const linkAbstracts = ac(user, [REQUIREMENTS.abstract.submit], {
    edition,
    isSubscribed,
  }) &&  isOpenAbstract

  return (
    <Card style={{ maxWidth: 400 }}>
      {/* {dump({ linkAbstracts, isOpenAbstract, isSubscribed, isUserAllowedToAbstracts })} */}
      {edition.getLogo() && (
        <div className="p-5 border-bottom card-edition-logo">
          <Card.Img variant="top" src={edition.getLogo()} />
        </div>
      )}
      <Card.Body className="" style={{ position: "relative" }}>
        {isSubscribed && (
          <div
            style={{
              position: "absolute",
              top: 0,
              transform: "translateY(-40%)",
            }}
          >
            <BadgeSubscribed />
          </div>
        )}
        <Card.Title>{edition?.getName()}</Card.Title>
        <Card.Text>{edition?.year}</Card.Text>
      </Card.Body>
      
      {(certs && certs.length > 0 && certCnf?.isAllowed()) && 
      <Card.Footer className="p-1 border-0 bg-white">
        <Link href={`/profile?tab=certificates`} passHref>
          <a className="btn btn-primary btn-block">{t('certificado.meus-certificados')}</a>
        </Link>
      </Card.Footer>}
      
      <Card.Footer className="p-0 border-0 bg-white">
        <div className="btn-group w-100 end start">
          {linkAbstracts && (
              <>
                <Link href={`/abstracts?edition=${edition?.id}`} passHref>
                  <a
                    className={`btn btn-outline-primary`}
                  >
                    {t("trabalho.meus-trabalhos")}
                  </a>
                </Link>
              </>
            )}
            {!isSubscribed && isOpenSubscribe && (
            <>
                <Link href={`/register2`} passHref>
                <a className="btn btn-primary">{t("fazer-inscricao")}</a>
                </Link>
            </>
            )}

            <Ac requires={[REQUIREMENTS.abstract.manage]}>
              <Link href={`/adm/abstracts?edition=${edition?.id}`} passHref>
                <a
                  className={`btn ${
                    isOpenAbstract ? "btn-outline-primary" : "btn-outline-secondary"
                  }`}
                >
                  Adm. {t("trabalhos")}
                </a>
              </Link>
              <Link href={`/adm/subscriptions?edition=${edition?.id}`} passHref>
                <a
                  className={`btn ${
                    isOpenAbstract ? "btn-outline-primary" : "btn-outline-secondary"
                  }`}
                >
                  Adm. {t("inscricoes")}
                </a>
              </Link>
            </Ac>

          {/*{!isCurrent && user.canManageAbstracts() && (<>*/}
          {/*  <Link href={`/adm/subscriptions?edition=${edition.getID()}`} passHref>*/}
          {/*    <a className={`btn ${isCurrent ? 'btn-outline-primary' : 'btn-outline-secondary'}`}>{t('inscricoes')}</a>*/}
          {/*  </Link>*/}
          {/*</>)}*/}
        </div>
      </Card.Footer>
      {/* {dump({
        canpublich: user.canPublishAbstracts(),
        is_abstract_open: isOpenAbstract,
        is_subs_open: isOpenSubscribe,
      })} */}
    </Card>
  );
}
