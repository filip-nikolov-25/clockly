import Wrapper from "../components/base/Wrapper";

const Homepage = () => {
  return (
    <div className="text-white">
      <section className="flex items-center justify-center min-h-screen text-center">
        <div>
          <h1 className="text-8xl font-bold mb-6">Clockly</h1>

          <p className="text-2xl text-orange-300 mb-10">
            Simple & powerful workforce time tracking
          </p>

          <p className="max-w-xl mx-auto text-gray-300 mb-10">
            Track working hours, manage employees, approve time-off requests and
            keep your team organized in one place.
          </p>

          <button className="px-10 py-4 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition">
            Get Started
          </button>
        </div>
      </section>

      <Wrapper>
        <section className="py-20">
          <h2 className="text-4xl text-center font-bold mb-16">
            Everything you need to manage your team
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-zinc-900 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-orange-400">
                Time Tracking
              </h3>
              <p className="text-gray-300">
                Employees can clock in and out while Clockly automatically
                calculates working hours and break time.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-orange-400">
                Time-Off Requests
              </h3>
              <p className="text-gray-300">
                Request vacation days easily and allow admins to approve or
                reject requests with one click.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-orange-400">
                Notifications
              </h3>
              <p className="text-gray-300">
                Stay updated with notifications about approvals, requests and
                admin actions.
              </p>
            </div>
          </div>
        </section>
      </Wrapper>

      <section className="bg-zinc-900 py-20">
        <Wrapper>
          <h2 className="text-4xl text-center font-bold mb-16">
            How Clockly Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div>
              <h3 className="text-2xl font-bold text-orange-400 mb-4">
                1. Create Account
              </h3>
              <p className="text-gray-300">
                Admins create accounts for employees and manage access.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-orange-400 mb-4">
                2. Track Work
              </h3>
              <p className="text-gray-300">
                Employees clock in and out while the system records hours
                automatically.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-orange-400 mb-4">
                3. Manage Requests
              </h3>
              <p className="text-gray-300">
                Admins approve time-off requests and monitor work logs.
              </p>
            </div>
          </div>
        </Wrapper>
      </section>

      <Wrapper>
        <section className="py-20">
          <h2 className="text-4xl text-center font-bold mb-16">
            Built for Teams
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-orange-400 text-black p-10 rounded-xl">
              <h3 className="text-3xl font-bold mb-6">For Employees</h3>

              <ul className="space-y-3">
                <li>✔ Clock in / clock out</li>
                <li>✔ Track worked hours</li>
                <li>✔ Request vacation days</li>
                <li>✔ Receive notifications</li>
              </ul>
            </div>

            <div className="bg-zinc-900 p-10 rounded-xl">
              <h3 className="text-3xl font-bold mb-6">For Admins</h3>

              <ul className="space-y-3 text-gray-300">
                <li>✔ Manage employees</li>
                <li>✔ Review work logs</li>
                <li>✔ Approve time-off requests</li>
                <li>✔ Monitor productivity</li>
              </ul>
            </div>
          </div>
        </section>
      </Wrapper>

      <section className="text-center py-24 bg-orange-400 text-black">
        <h2 className="text-4xl font-bold mb-6">
          Start managing your team better today
        </h2>

        <button className="px-10 py-4 bg-black text-white rounded-lg hover:bg-zinc-800 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Homepage;
