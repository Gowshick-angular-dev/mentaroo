import logo from './logo.svg';
import AppRoutes from './Components/routing/AppRoutings';
import "../src/_mentro/assets/scss/app.scss";
import "../src/_mentro/assets/scss/theme/_responsive.scss";
// import "../src/_mentro/assets/scss/theme/_variables.scss"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider } from './Components/Auth/core/Auth';
import { PageProvider, usePage } from './Components/pages/core/PageProvider';
import cn from 'classnames';
import 'react-phone-input-2/lib/style.css'

function App() {
  return (
    <div className="">
      <PageProvider>
         <AuthProvider>
            <AppRoutes />
              <Toaster
                toastOptions={{
                    success: {
                      style: {
                        color: '#125453'
                      },
                      iconTheme: {
                        primary: '#125453',
                      }
                    }
                  }}
                  position="bottom-center"
                reverseOrder={false}
              />
        </AuthProvider>
      </PageProvider>
    </div>
  );
}

export default App;
