"use client";

import { useMemo, useState } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "../ui/use-toast";
import type { UpdateUserPreferencesResponse } from "@/types";
import {
  URL_CHANGE_PREFERENCES,
  availableCurrency,
  availableDateFormatTypes,
  themeOptions,
} from "@/utils/const";
import { UpdatePreferencesFormValue } from "@/schemas/update-preferences-schema";
import { ChangeUserPreferencesForm } from "../forms/user-preferences-form/change-user-preferences-form";
import { useTheme } from "next-themes";
import { useCurrency } from "@/hooks/use-currency";
import { useDateFormat } from "@/hooks/use-date-format";
import { DateFormatType } from "@/contexts/date-format-provider";
import { CurrencyType } from "@/contexts/currency-provider";
import { useSession } from "next-auth/react";

interface ChangePreferencesBlockProps {
  resetAccordion: () => void;
}

export interface DropdownData {
  key: keyof UpdatePreferencesFormValue;
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
}

const parsedAvailableCurrency = Object.entries(availableCurrency).map(
  ([key, value]) => ({ label: `${key} (${value})`, value }),
);

const parsedAvailableDateFormatTypes = Object.entries(
  availableDateFormatTypes,
).map(([key, value]) => ({ label: `${key} (${value})`, value: value }));

const parsedThemeOptions = themeOptions.map((themeOpt) => ({
  label: themeOpt.name,
  value: themeOpt.key,
}));

const dropdownsData: DropdownData[] = [
  {
    key: "dateFormat",
    label: "Date Format",
    placeholder: "Select the date format you want to use",
    options: parsedAvailableDateFormatTypes,
  },
  {
    key: "currency",
    label: "Currency",
    placeholder: "Select the currency you want to use",
    options: parsedAvailableCurrency,
  },
  {
    key: "theme",
    label: "Theme",
    placeholder: "Select the theme you want to use",
    options: parsedThemeOptions,
  },
];

export const ChangePreferencesBlock = ({
  resetAccordion,
}: ChangePreferencesBlockProps) => {
  const { setTheme, theme } = useTheme();
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { fetchPetition } = useFetch();
  const { dateFormat, setDateFormat } = useDateFormat();
  const { currency, setCurrency } = useCurrency();

  const defaultValues = useMemo(
    () => ({ theme, dateFormat, currency }),
    [theme],
  );

  const onSubmit = async (data: UpdatePreferencesFormValue) => {
    setIsLoading(true);
    const response = await fetchPetition<UpdateUserPreferencesResponse>({
      method: "POST",
      url: URL_CHANGE_PREFERENCES,
      body: { ...data },
    });

    if (response.error) {
      toast({
        title: "Error changing the preferences",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      await update({
        ...(data.dateFormat ? { dateFormat: data.dateFormat } : {}),
        ...(data.currency ? { currency: data.currency } : {}),
        ...(data.theme ? { theme: data.theme } : {}),
      });
      if (data.dateFormat) {
        setDateFormat(data.dateFormat as DateFormatType);
      }
      if (data.currency) {
        setCurrency(data.currency as CurrencyType);
      }
      if (data.theme) {
        setTheme(data.theme);
      }
      toast({
        title: "Preferences changed successfully",
        description: response.message,
        variant: "success",
      });
      resetAccordion();
    }
    setIsLoading(false);
  };

  return (
    <div>
      <p className="pb-4 text-muted-foreground xl:max-w-[811px] xl:mx-auto">
        This changes take effect immediately
      </p>
      <ChangeUserPreferencesForm
        dropdownsData={dropdownsData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        defaultValues={defaultValues}
      />
    </div>
  );
};
