import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2 hover:scale-105 transition-all"
          src={currentUser.avatar}
          alt="profile"
        />
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg  focus:outline-green-400"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg  focus:outline-green-400"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg  focus:outline-green-400"
          id="password"
        />
        <button className="uppercase p-3 bg-slate-700 text-white hover:opacity-95 disabled:opacity-80 rounded-lg">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer hover:opacity-95">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer hover:opacity-95">
          Sign out
        </span>
      </div>
    </div>
  );
};

export default Profile;
