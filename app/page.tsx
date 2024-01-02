import ErrorMessageNotLoggedIn from "@/components/ErrorMessageNotLoggedIn";

const Home = () => {

  return (
    <main className="">
      <ErrorMessageNotLoggedIn/>
      <div className="">
        User search for their own details in this page. (No Login Required)
      </div>
    </main>
  );
};

export default Home;
