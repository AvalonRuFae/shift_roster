import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Table } from "@heroui/react";

export default function IndexPage() {
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<div className="inline-block max-w-lg text-center justify-center">
					<Table>
						<Table.ScrollContainer>
							<Table.Content aria-label="Example table">
								<Table.Header>
									<Table.Column>Name</Table.Column>
									<Table.Column>Role</Table.Column>
								</Table.Header>
								<Table.Body>
									<Table.Row>
										<Table.Cell>Kate Moore</Table.Cell>
										<Table.Cell>CEO</Table.Cell>
									</Table.Row>
								</Table.Body>
							</Table.Content>
						</Table.ScrollContainer>
						<Table.Footer>{/* Optional footer content */}</Table.Footer>
					</Table>
				</div>
			</section>
		</DefaultLayout>
	);
}
