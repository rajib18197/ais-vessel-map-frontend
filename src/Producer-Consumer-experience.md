## Consumer Experience vs. Producer Experience

In a longer-lived application, the stuff that often makes the difference between a React application that feels maintainable vs. one that doesn't is this idea:

> **The consumer experience is often much more important than the producer experience.**

When I was introduced with this idea first time, I continuously getting a feel for it. Take a look at this screenshot. It is from the book called _Operating System: Three Easy Pieces_:

![Abstraction of the OS: Process](image.png)

Operating System Codebase is a closed system. From a consumer point of view, none of it directly accessible. Instead, consumers interface with the OS through system calls (APIs) just like the paragraph emphasize.

This is a really common thing in software. Every time we `npm install` a package, we consume a chunk of code that another developer has produced.

The realization I had is that React components are closed systems, just like Twitter.

Each component is a bundle of markup, styles, and logic, and from the consumer point of view, none of it is directly accessible. Instead, consumers interface with React components through props.

When we produce React components, we control what the props are, what the props do, what props are not included… This is a tremendous amount of power, an opportunity to make something really good, or really bad.

And so for that reason, I think, we should be really intentional about the way we set up the props for our components.
