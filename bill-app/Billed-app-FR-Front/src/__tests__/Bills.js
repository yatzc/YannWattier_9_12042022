/**
 * @jest-environment jsdom
 */

import {screen, waitFor}       from "@testing-library/dom"
import userEvent               from "@testing-library/user-event"
import BillsUI                 from "../views/BillsUI.js"
import { bills }               from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import {localStorageMock}      from "../__mocks__/localStorage.js";
import router                  from "../app/Router.js";
import LoadingPage             from "../views/LoadingPage.js";
import ErrorPage               from "../views/ErrorPage.js";
import Bills                   from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then loading = true", () => {
            const html = BillsUI({ data: [], loading: true });
            document.body.innerHTML = html;
            expect(LoadingPage());
        })
    })
    describe("When I am on Bills Page", () => {
        test("Then error = true", () => {
            const html = BillsUI({ data: [], error: true });
            document.body.innerHTML = html;
            expect(ErrorPage())
        })
    })
    describe("When I am on Bills Page", () => {
        test("then i click on icon eye a popup window apear", () => {
    
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }));
            const html = BillsUI({ data: [bills[0]] });
            document.body.innerHTML = html;
            const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
            }
            const firestore = null;
            const newBills = new Bills({ document, onNavigate, firestore, localStorage });
            $.fn.modal = jest.fn();
            const eye = screen.getByTestId("icon-eye");
            const handleClickIconEye = jest.fn(() => newBills.handleClickIconEye(eye));
            eye.addEventListener('click', handleClickIconEye);
            userEvent.click(eye);
            expect(handleClickIconEye).toHaveBeenCalled();
            expect(screen.getByText('Justificatif')).toBeTruthy();
        });
    });
    describe("When I am on Bills Page", () => {
        test("then i click on NewBill button i must be redirect to NewBill", () => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const html = BillsUI({ data: [bills[0]] });
            document.body.innerHTML = html;
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            }
            const firestore = null;
            const newBills = new Bills({ document, onNavigate, firestore, localStorage });
            const btn = screen.getByTestId("btn-new-bill");
            const handleClickNewBill = jest.fn(() => newBills.handleClickNewBill);
            btn.addEventListener('click', handleClickNewBill);
            userEvent.click(btn);
            expect(handleClickNewBill).toHaveBeenCalled();
            expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();
        });
    });
});

// test d'intégration GET
describe('Given I am connected as an employee', () => {
    describe('When I am on the Bills page', () => {
        test.todo('fetches bills from mock API GET');
        test.todo("fetches bills from an API and fails with 404 message error");
        test.todo("fetches bills from an API and fails with 500 message error");
    });
});