import { useCallback, useEffect, useMemo, useState } from "react";
import { Table, EmptyState, RoundIcon, SortDirection, Button } from "vienna-ui";
import { CloseCancelX } from "vienna.icons";

type DataRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phone: string;
  company: string;
};

const DataRowKeys: { [K in keyof DataRow]: K } = {
  id: "id",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  birthDate: "birthDate",
  phone: "phone",
  company: "company",
};

type SortType =
  | {
      field: string;
      direction: SortDirection;
    }
  | undefined;

type FilterType = Record<keyof DataRow, any> | undefined;

export const UserTable = () => {
  const [dataTable, setDataTable] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<FilterType>();
  const [sort, setSort] = useState<SortType>();

  const toDataTable = (data: Array<any>): DataRow[] => {
    return data.map(
      (user): DataRow => ({
        id: user.id,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        birthDate: user.birthDate,
        phone: user.phone,
        company: user.company.name,
      })
    );
  };

  const fetchData = useCallback(() => {
    fetch("https://jsonplaceholder.org/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((users) => {
        setDataTable(toDataTable(users));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSort = (_: any, data: SortType) => {
    setSort(data);
  };
  const onFilter = (data: FilterType) => {
    setFilter(Object.assign({}, data));
  };

  const data = useMemo(
    function () {
      let data = dataTable;
      if (filter) {
        data = data.filter((row) => {
          let filtered = true;

          if (filtered && filter.firstName) {
            const re = new RegExp(filter.firstName, "i");
            filtered = filtered && row.firstName.search(re) !== -1;
          }
          if (filtered && filter.lastName) {
            const re = new RegExp(filter.lastName, "i");
            filtered =
              (filtered && !filter.lastName) || row.lastName.search(re) !== -1;
          }
          if (filtered && filter.email) {
            const re = new RegExp(filter.email, "i");
            filtered =
              (filtered && !filter.email) || row.email.search(re) !== -1;
          }
          if (filtered && filter.company) {
            const re = new RegExp(filter.company, "i");
            filtered =
              (filtered && !filter.company) || row.company.search(re) !== -1;
          }
          if (filtered && filter.phone) {
            const re = new RegExp(filter.phone, "i");
            filtered =
              (filtered && !filter.phone) || row.phone.search(re) !== -1;
          }

          return filtered;
        });
      }
      if (sort) {
        const { field, direction } = sort;
        const dir = direction === "desc" ? 1 : -1;
        data = data.sort((a, b) => {
          const nameA = a[field as keyof DataRow].toUpperCase();
          const nameB = b[field as keyof DataRow].toUpperCase();

          const result = nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          return result * dir;
        });
      }
      return data;
    },
    [dataTable, filter, sort]
  );

  return (
    <Table data={data} onFilter={onFilter} onSort={onSort}>
      <Table.Column id="id" title="#" />
      <Table.Column
        id={DataRowKeys.firstName}
        title="First Name"
        sortable
        filter={<Table.InputFilter />}
      />
      <Table.Column
        id={DataRowKeys.lastName}
        title="Last Name"
        sortable
        filter={<Table.InputFilter />}
      />
      <Table.Column id={DataRowKeys.birthDate} title="Birthdate" />
      <Table.Column
        id={DataRowKeys.email}
        title="Email"
        filter={<Table.InputFilter />}
      />
      <Table.Column
        id={DataRowKeys.phone}
        title="Phone"
        filter={<Table.InputFilter />}
      />
      <Table.Column
        id={DataRowKeys.company}
        title="Company"
        filter={<Table.InputFilter />}
      />

      {data.length === 0 && loading && (
        <EmptyState loading>
          <EmptyState.Title>Загружаем данные</EmptyState.Title>
          <EmptyState.Description>
            Мы загружаем данные таблицы, очень скоро они будут готовы.
          </EmptyState.Description>
        </EmptyState>
      )}
      {data.length === 0 && error && (
        <EmptyState>
          <RoundIcon color="nice10">
            <CloseCancelX />
          </RoundIcon>
          <EmptyState.Title>Ошибка загрузки данных</EmptyState.Title>
          <EmptyState.Description>Что-то пошло не так.</EmptyState.Description>
          <EmptyState.Actions>
            <Button design="accent" onClick={() => fetchData()}>
              Обновить
            </Button>
          </EmptyState.Actions>
        </EmptyState>
      )}
    </Table>
  );
};
