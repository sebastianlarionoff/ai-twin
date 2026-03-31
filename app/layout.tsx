// This is the layout file for the app.
// Add your layout components here.

export default function Layout({ children }) {
    return (
        <div>
            <header>
                <h1>My App</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>Footer content here</p>
            </footer>
        </div>
    );
}