import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { take, timeout, timer } from "rxjs";

const open = (props: {
  title: string;
  content: string;
  type: "success" | "error" | "info" | "warning";
}) => {
  const rootDom = document.getElementById("base-modal");
  if (!rootDom) return;
  while (rootDom.firstChild) {
    rootDom.removeChild(rootDom.firstChild);
  }
  const root = createRoot(rootDom as HTMLElement);

  const Totast = (props: {
    title: string;
    content: string;
    type: "success" | "error" | "info" | "warning";
  }) => {
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
      setVisible(true);
      const run = timer(3000)
        .pipe(take(1))
        .subscribe(() => {
          setVisible(false);
          root.unmount();
          run.unsubscribe();
        });
    }, []);
    return (
      <Modal defaultOpen placement="top" size="sm">
        <ModalContent>
          <ModalBody>
            <h3 className={"text-xl font-bold"}>{props.title}</h3>
            <p className={"text-sm"}>{props.content}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  root.render(<Totast {...props} />);
};

export default {
  open,
};
