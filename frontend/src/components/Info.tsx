export function Info() {
	return (
		<section className="flex flex-col items-center justify-center text-center py-24 bg-gradient-to-b from-blue-50 to-white">
			<h2 className="text-4xl font-bold mb-4 text-gray-800">
				Connect Customers and Companies Seamlessly
			</h2>
			<p className="text-gray-600 max-w-xl mb-8">
				Real-time chat powered by Go and React. Secure, fast, and made for business interactions.
			</p>
			<a
				href="/login"
				className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
			>
				Get Started
			</a>
		</section>
	);
}
