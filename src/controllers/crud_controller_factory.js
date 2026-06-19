exports.createCrudController = (Model, options) => {
  const {
    singular,
    plural,
    include,
    order = [['id', 'ASC']],
    buildCreateBody,
    buildUpdateBody
  } = options;

  const getInclude = () => (typeof include === 'function' ? include() : include);

  return {
    async create(req, res) {
      try {
        const payload = buildCreateBody ? buildCreateBody(req.body, req) : req.body;
        const record = await Model.create(payload);

        res.status(201).json({
          success: true,
          [singular]: record
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async list(_req, res) {
      try {
        const records = await Model.findAll({
          include: getInclude(),
          order
        });

        res.json({
          success: true,
          [plural]: records
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async getById(req, res) {
      try {
        const record = await Model.findByPk(req.params.id, {
          include: getInclude()
        });

        if (!record) {
          return res.status(404).json({ error: `${singular} not found` });
        }

        res.json({
          success: true,
          [singular]: record
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async update(req, res) {
      try {
        const record = await Model.findByPk(req.params.id);

        if (!record) {
          return res.status(404).json({ error: `${singular} not found` });
        }

        const payload = buildUpdateBody ? buildUpdateBody(req.body, req) : req.body;
        await record.update(payload);

        res.json({
          success: true,
          [singular]: record
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async remove(req, res) {
      try {
        const record = await Model.findByPk(req.params.id);

        if (!record) {
          return res.status(404).json({ error: `${singular} not found` });
        }

        await record.destroy();

        res.json({
          success: true,
          message: `${singular} deleted successfully`
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  };
};
