import HomeLayout from "../components/HomeLayout";

const useHomeLayout = (Component) => {
  return (
    <HomeLayout>
      <Component />
    </HomeLayout>
  );
};

export default useHomeLayout;
