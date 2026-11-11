function AboutPage() {
  const values = [
    {
      title: "Simplicity",
      description:
        "Great technology should be easy to understand and effortless to use.",
      icon: "✨",
    },
    {
      title: "Innovation",
      description:
        "We continuously explore better ways to solve everyday challenges.",
      icon: "💡",
    },
    {
      title: "Reliability",
      description:
        "We prioritize consistency, performance, and trust in everything we build.",
      icon: "🛡️",
    },
    {
      title: "User First",
      description:
        "Every decision begins with understanding the people who use our platform.",
      icon: "❤️",
    },
  ];

  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gray-50 px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            About Us
          </span>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Building Better Experiences Through Technology
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600">
            We believe technology should make everyday experiences simpler,
            smarter, and more meaningful.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <span className="font-semibold uppercase tracking-wider text-blue-600">
            Who We Are
          </span>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Technology with a Purpose
          </h2>
        </div>

        <div className="space-y-4 leading-8 text-gray-600">
          <p>
            Our platform is built around creating intuitive digital
            experiences that solve real-world problems.
          </p>

          <p>
            We focus on combining thoughtful design, reliable technology,
            and user-centric solutions to make every interaction seamless.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-blue-600 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Our Mission
          </h2>

          <p className="text-lg leading-8 text-blue-50">
            Our mission is to build accessible, reliable, and innovative
            solutions that empower people to accomplish more with less
            complexity.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <span className="font-semibold uppercase tracking-wider text-blue-600">
            What Drives Us
          </span>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Our Core Values
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            The principles that guide our decisions and shape everything
            we create.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 text-3xl">{value.icon}</div>

              <h3 className="mb-3 text-xl font-semibold">
                {value.title}
              </h3>

              <p className="text-sm leading-7 text-gray-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Section */}
      <section className="bg-gray-50 px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-5 text-3xl font-bold md:text-4xl">
            Always Moving Forward
          </h2>

          <p className="text-lg leading-8 text-gray-600">
            We are constantly learning, improving, and evolving. Our goal
            is not simply to build another digital platform, but to create
            something genuinely useful that grows alongside the people
            who use it.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;