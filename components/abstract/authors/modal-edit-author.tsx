import Modal from "react-bootstrap/Modal";
import { useAuthorsContext } from "./authors-context";
import Button from "react-bootstrap/Button";
import { Form, Formik } from "formik";
import { dump } from "../../../src/helpers";
import Text from "../../ui/form/formik/text";
import Wysiwyg from "../../ui/form/formik/wysiwyg";
import Loading from "../../ui/loading";
import LoadingButton from "../../ui/loading-button";
import { useState } from "react";
import WpAuthor from "../../../src/http/wp-author";
import useTrans from "../../hooks/useTrans";
import useSettings from "../../hooks/useSettings";

export default function ModalEditAuthor() {
  const t = useTrans();
  const { abstractId, selectedAuthor, setSelectedAuthor, data, setData } =
    useAuthorsContext();
  const showModal = selectedAuthor !== null;
  const [loading, setLoading] = useState(false);
  const { currentEdition: edition } = useSettings();
  const AbstractCnf = edition?.Abstract();
  const FieldAuthors2 = AbstractCnf?.getField("authors2");

  function handleClose() {
    setSelectedAuthor(null);
  }

  async function handleSubmit(values: any) {
    setLoading(true);
    const axios = await WpAuthor.update(selectedAuthor.id, {
      name: values.name,
      email: values.email,
      company: values.company,
      bio: values.bio,
      bio2: values.bio2,
      bio3: values.bio3,
    });
    const resp = axios.data;
    if (resp.success) {
      // update author on data with setData
      const index = data.findIndex((a) => a.id === selectedAuthor.id);
      if (index === -1) return;
      const newData = [...data];
      newData[index] = { ...selectedAuthor, ...resp.data };
      setData(newData);
      handleClose();
    }
    setLoading(false);
  }

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Formik initialValues={selectedAuthor} onSubmit={handleSubmit}>
        {({ values, errors }) => (
          <Form>
            <Modal.Header>
              <Modal.Title>Editar autor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Text name="name" label={t("cadastro.nome")} />
              <Text name="email" label="E-mail" />
              <Text
                name="company"
                label={t("cadastro.instituicao.instituicao")}
              />
              <Wysiwyg name="bio" label={t("autor.bio")} 
                charsMin={FieldAuthors2?.bio_max ? 1 : 0} 
                charsMax={FieldAuthors2?.bio_max || 0} />
              <Wysiwyg name="bio2" label={t("autor.bio2")} 
                charsMin={FieldAuthors2?.bio2_max ? 1 : 0} 
                charsMax={FieldAuthors2?.bio2_max || 0} />
              <Wysiwyg name="bio3" label={t("autor.bio3")} 
                charsMin={FieldAuthors2?.bio3_max ? 1 : 0} 
                charsMax={FieldAuthors2?.bio3_max || 0} />
              {/* {dump(values)} */}
            </Modal.Body>
            <Modal.Footer className="modal-footer--sticky bg-light">
              <Button variant="outline-secondary" onClick={handleClose}>
                {t("cancelar")}
              </Button>
              <LoadingButton loading={loading}>{t("salvar")}</LoadingButton>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
