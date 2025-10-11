export function Info() {
	return (
		<section className="flex flex-col items-center justify-center text-center flex-1 py-24 px-6">
			<h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 max-w-2xl leading-tight">
				Connect Customers and Companies Seamlessly
			</h2>
			<p className="text-gray-600 max-w-xl mb-8 text-lg">
				Real-time chat powered by Go and React. Secure, fast, and made for
				business interactions.
			</p>
			<a
				href="/login"
				className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-200"
			>
				Get Started
			</a>
		</section>
	);
}
