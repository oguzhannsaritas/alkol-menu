import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    User,
    Pagination,
    Selection,
    SortDescriptor
} from "@nextui-org/react";
import { SearchIcon } from "../../../public/ıcon/SearchIcon";
import { columns, users } from "@/_data/alkoller";

const INITIAL_VISIBLE_COLUMNS = ["marka", "fiyat", "cl"];

type User = typeof users[0];

export default function App() {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor] = React.useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredUsers;
    }, [hasSearchFilter, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: User, b: User) => {
            const first = a[sortDescriptor.column as keyof User] as number;
            const second = b[sortDescriptor.column as keyof User] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];

        switch (columnKey) {
            case "marka":
                return (
                    <div className="flex items-center">
                        <User
                            className="w-auto h-8 rounded-full mr-2"
                            avatarProps={{ radius: "lg", src: user.avatar }}
                            description={user.name}
                            name={cellValue}
                        >
                            {user.name}
                        </User>
                    </div>
                );
            case "fiyat":
                return (
                    <div className="flex items-center">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                        <p className="text-bold text-tiny capitalize text-default-400">{user.price}</p>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col  gap-4">
                <div className="flex justify-between h-28 gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%] "
                        placeholder="ALKOL İSMİNİ GİRİNİZ..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                </div>
                <div className="responsiveContainer">
                    <span className=" bg-[#e5e7eb] mobilResponsive2 rounded-3xl border-solid border-[1px] border-b-4 border-t-4 pl-2 pr-2 text-[#71717A] text-small">Toplam alkol sayısı : {users.length} </span>
                    <label className="flex items-center mobilResponsive2 justify-center bg-[#e5e7eb] rounded-3xl border-solid border-[1px] border-b-4 border-t-4 pl-2 pr-2 text-[#71717A] text-small">
                       Sayfa başına satır sayısı:
                        <select
                            className="bg-transparent  text-[#71717A] text-small "
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                        </select>
                    </label>
                </div>


            </div>
        );
    }, [filterValue, onSearchChange, onRowsPerPageChange, onClear]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-center items-center">

                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="  mobilResponsive3 sm:ml-6 w-[30%] justify-end gap-2 " >
                    <Button className="bg-[#f4f4f5] mr-4" isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        GERİ
                    </Button>
                    <Button className="bg-[#f4f4f5]" isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        İLERİ
                    </Button>
                </div>
            </div>
        );
    }, [page, pages, onPreviousPage, onNextPage]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "lg:w-[800px] md:w-[700px] sm:w-[600px] mobilResponsive  mx-auto max-h-[400px] hover:transform hover:-translate-y-1 hover:scale-105",
                table: "custom-table-class"

            }}
            selectedKeys={selectedKeys}
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody  emptyContent={"No users found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
