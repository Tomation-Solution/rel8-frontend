interface Props {
  title: string | undefined;
}
const BreadCrumb = ({ title }: Props) => {
  return <h3 className="font-bold mb-2 text-xl">{title}</h3>;
};

export default BreadCrumb;
