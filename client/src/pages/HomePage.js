import Header from '../shared/Header';
import Footer from '../shared/Footer';
import ProductList from "../ProductList";


export default function HomePage() {
    return (
        <div className='md:h-[calc(100vh-90px)] flex flex-col items-center'>
            <Header />
            <h1>Il Forno di Mattia</h1>
            <ProductList />
            <Footer />
        </div>
    )
}