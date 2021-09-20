import { Dispatch } from 'react';
import { Customer } from '../interfaces';
import { CustomerAction, RootState } from '../app-types';
import { handleAxiosApi, getResponseErrorMessage } from '../utils/functions';
import { useCustomerApi } from '../apis';
import { useDispatch } from 'react-redux';

export const useCustomerRepository = () => {
  const dispatch = useDispatch<Dispatch<CustomerAction>>();
  const customerApi = useCustomerApi();

  const list = async () => {
    try {
      dispatch({ type: 'CUSTOMER:LISTING', flag: true });
      const customers = await handleAxiosApi<Customer[]>(customerApi.list());
      dispatch({ type: 'CUSTOMER:LIST', customers });
    } catch (error) {
      dispatch({ type: 'CUSTOMER:LIST_FAILED', message: getResponseErrorMessage(error) });
    } finally {
      dispatch({ type: 'CUSTOMER:LISTING', flag: false });
    }
  };

  const create = async (customer: Customer) => {
    try {
      dispatch({ type: 'CUSTOMER:CREATING', flag: true });
      const createdCustomer = await handleAxiosApi<Customer>(customerApi.create(customer));
      dispatch({ type: 'CUSTOMER:CREATE', customer: createdCustomer });
    } catch (error) {
      dispatch({ type: 'CUSTOMER:CREATE_FAILED', message: getResponseErrorMessage(error) });
    } finally {
      dispatch({ type: 'CUSTOMER:CREATING', flag: false });
    }
  };

  const update = async (id: number, customer: Customer) => {
    try {
      dispatch({ type: 'CUSTOMER:UPDATING', flag: true });
      const updatedCustomer = await handleAxiosApi<Customer>(customerApi.update(id, customer));
      dispatch({ type: 'CUSTOMER:UPDATE', id, customer: updatedCustomer });
    } catch (error) {
      dispatch({ type: 'CUSTOMER:UPDATE_FAILED', message: getResponseErrorMessage(error) });
    } finally {
      dispatch({ type: 'CUSTOMER:UPDATING', flag: false });
    }
  };

  const remove = async (id: number) => {
    try {
      dispatch({ type: 'CUSTOMER:REMOVING', flag: true });
      await handleAxiosApi(customerApi.remove(id));
      dispatch({ type: 'CUSTOMER:REMOVE', id });
    } catch (error) {
      dispatch({ type: 'CUSTOMER:REMOVE_FAILED', message: getResponseErrorMessage(error) });
    } finally {
      dispatch({ type: 'CUSTOMER:REMOVING', flag: false });
    }
  };

  const getCustomerState = (state: RootState) => state.customerState;

  return {
    list,
    create,
    update,
    remove,
    getCustomerState,
  };
};
