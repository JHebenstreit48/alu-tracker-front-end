import { useEffect } from 'react';

function PageTab(props: { title: string; children: React.ReactNode }) {
  useEffect(() => {
    document.title = `AL Tracker | ${props.title}`;
    window.scrollTo(0, 0);
  }, [props.title]);

  return (
    <>
      <div>{props.children}</div>
    </>
  );
}

export default PageTab;
