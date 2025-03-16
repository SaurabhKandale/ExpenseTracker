import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";


export const useDispatchHook=useDispatch.withTypes<AppDispatch>();
export const useSelectorHook=useSelector.withTypes<RootState>();